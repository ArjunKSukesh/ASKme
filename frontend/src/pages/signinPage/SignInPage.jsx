import { SignIn } from '@clerk/clerk-react';
import './signinPage.css';

export default function SignInPage() {
  return (
    <div className='signinPage'>
      <SignIn 
      path='/sign-in' 
      signUpUrl='/sign-up' 
      forceRedirectUrl={'/dashboard'}
      />
      
    </div>
  )
}
