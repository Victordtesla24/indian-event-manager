import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/carousel.css';

const events = [
  {
    id: '1',
    title: 'Shikayala Gelo Ek!',
    imageUrl: '/images/events/gettyimages-1427976248-612x612.jpg'
  },
  {
    id: '2',
    title: 'Jyachi Tyachi Love Story',
    imageUrl: '/images/events/gettyimages-1702362815-612x612.jpg'
  },
  {
    id: '3',
    title: 'Punha Sahi Re Sahi',
    imageUrl: '/images/events/gettyimages-1735021730-612x612.jpg'
  }
];

const HeroCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <div style={{ position: 'absolute', bottom: '40px', width: '100%' }}>
        <ul className="flex justify-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <button type="button" className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all" />
    )
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] min-h-[500px] max-h-[800px]">
      <Slider {...settings} className="h-full">
        {events.map((event) => (
          <div key={event.id} className="relative h-full">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-[15%] left-[10%] text-white max-w-xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">{event.title}</h2>
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;
