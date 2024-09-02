import { SignUp } from '@clerk/clerk-react';
import './signupPage.css';


export default function SignUpPage() {
  return (
    <div className='signupPage'>
      <SignUp path='/sign-up' signInUrl='/sign-in'/>
    </div>
  )
}
