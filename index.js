import Head from "next/head";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import SectionTitle from "../components/sectionTitle";

import { benefitOne, benefitTwo } from "../components/data";
import Video from "../components/video";
import Benefits from "../components/benefits";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import Cta from "../components/cta";
import Faq from "../components/faq";
import PopupWidget from "../components/popupWidget";

const Home = () => {
  return (
    <>
      <Head>
        <title>Tube Route Assist</title>
        <meta
          name="description"
          content="Tube Route Assist is your ultimate companion for navigating the bustling London Underground with ease and confidence."
        />
        <link img src="tube-route-assist\public\img\underground.png"></link>
      </Head>

      <Navbar />
      <Hero />
      <SectionTitle
        pretitle="Tube Route Assist"
        title="About Us">
        
        The Tube Route Assist is a mobile application designed to facilitate seamless navigation and travel planning on the London Underground, also known as the Tube. As one of the world's oldest and busiest subway systems, the London Underground can be complex to navigate, especially for visitors and tourists. The Tube Route Assist aims to simplify this process and enhance the overall commuter experience for locals and travelers alike.
        
      </SectionTitle>
      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />
      <SectionTitle
        pretitle="Watch a video"
        title="Exploring London Underground: A Journey Through Time and Space">
        Welcome to the mesmerizing world of the London Underground, where history, innovation, and bustling energy converge to create an unparalleled urban experience. 
      </SectionTitle>
      <Video />
      <SectionTitle
        pretitle="Testimonials"
        title="Here's what our customers said">
        Discover the power of authentic testimonials! 🌟 Our satisfied customers share their experiences, revealing the real impact of our products/services.
      </SectionTitle>
      <Testimonials />
      <SectionTitle pretitle="FAQ" title="Frequently Asked Questions">
      Check out our FAQs section for quick solutions to your queries. From common concerns to in-depth details, we've covered it all to make your experience hassle-free! Don't hesitate to explore - knowledge awaits!
      </SectionTitle>
      <Faq />
      <Cta />
      <Footer />
      <PopupWidget />
    </>
  );
}

export default Home;