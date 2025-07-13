// Library Imports
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div id="errorWrapper">
      <div className="container">
        <img
          src="https://cdn.dribbble.com/users/1012566/screenshots/4187820/media/985748436085f06bb2bd63686ff491a5.jpg?resize=400x300&vertical=center"
          alt="404"
        />
        <div className="buttonWrapper">
          <button onClick={() => navigate('/')}>Go to home screen</button>
        </div>
      </div>
    </div>
  );
}
