import TextSlider from '../TextSlider/TextSlider'
import Logo from '../../assets/Logo.svg'
import LoginImage from '../../assets/loginImage.png'
import '../../App.css'

export default function Login() {
    return (
        <section className='login-container'>
            <div className="left-section">
                <div className="logo">
                    <img src={Logo} alt='' />
                </div>
                <div>
                    <form className='form-container'>
                        <h1>Log In</h1>
                        <p className='sign-in'>Sign in to continue</p>
                        <div className="form-fields">
                            <input className='email' type="email" placeholder='Email'/>
                            <input type="password" placeholder='Password'/>
                            <p className='forgot'>Forgot Password?</p>
                            <button className='sign-in-button'>Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="right-section">
                <img src={LoginImage} alt=''/>
                <TextSlider />
            </div>
        </section>
    )
}
