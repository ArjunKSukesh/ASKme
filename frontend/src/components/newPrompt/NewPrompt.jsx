import { useEffect, useRef, useState } from 'react';
import './newPrompt.css'
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
import Markdown from 'react-markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NewPrompt({ data }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const endRef = useRef(null);
  const formRef = useRef(null);
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},      
    aiData: {}
  });
     
  // const chat = model.startChat({
  //   history: [
  //     data?.history.map(({ role, parts }) => ({
  //       role,
  //       parts: [{ text: parts[0].text }],
  //     })),
  //   ],
  //   generationConfig: {
  //     // maxOutputTokens: 100,
  //   },
  // });

  const chat = model.startChat({
    history: Array.isArray(data?.history) && data.history.length > 0
      ? data.history.map(({ role, parts }) => ({
          role,
          parts: [{ text: parts[0].text }],
        }))
      : [], // Default to an empty array if history is invalid
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });
  

 
  

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data,question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });
  

  
  const add = async (text, isInitial) => {
   if(!isInitial) setQuestion(text);
    try {

      if(!text){
        console.error('Text is undefined or empty');
        return;
      }
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      mutation.mutate();
    } catch (err) {
      console.log("Error in add function",err)
    }
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value.trim();
    if (!text) return;

    add(text,false);
  };

  // IN PRODUCTION WE DON'T NEED IT 
  const hasRun = useRef(false);

  useEffect(() => {
    if(!hasRun.current){
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true)
      }
    }
    hasRun.current = true;
  },[])

  // useEffect(() => {
  //   if (!hasRun.current && data?.history?.length) {
  //     const initialMessage = data.history[0]?.parts[0]?.text;
  //     if (initialMessage) {
  //       add(initialMessage, true);
  //     }
  //   }
  //   hasRun.current = true;
  // }, []);
  

  
  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className='message user'>{question}</div>}
      {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
      <div className="endChat" ref={endRef}></div>
      <form className='newForm' onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input type="file" id='file' multiple={false} hidden />
        <input type="text" name='text' autoComplete='off' placeholder='Ask me anything...' />
        <button >
          <img src="/arrow.png" alt="" />
        </button>
      </form>

    </>
  )
}
