const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 grid grid-cols-2 overflow-hidden">
      <div className="relative">
        <img 
          src="/ganesha1.jpeg"
          alt="Ganesha background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="eager"
        />
      </div>
      <div className="relative">
        <img 
          src="/peacock1.avif"
          alt="Peacock background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default Background;
