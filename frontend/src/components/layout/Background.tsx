import '../../styles/background.css';

const Background = () => {
  return (
    <div className="background-container">
      <div className="background-section left float-animation">
        <img 
          src="/images/ganesha1.jpeg"
          alt="Ganesha background"
          className="background-image"
          loading="eager"
        />
        <div className="pattern-overlay" />
      </div>
      <div className="background-section right sway-animation">
        <img 
          src="/images/peacock1.avif"
          alt="Peacock background"
          className="background-image"
          loading="eager"
        />
        <div className="pattern-overlay" />
      </div>
    </div>
  );
};

export default Background;
