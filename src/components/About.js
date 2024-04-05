import React from "react";
import Footer from "./Footer";
import img2 from "../img/youngOutlaw.png";
import "./css/About.css";

function About() {
  return (
    <div className="about-background-image">
      <div className="about-container mt-5">
        <h1>DUSTY COLE: OLD SOUL IN A YOUNG BODY</h1>
        <section className="image-section image-section-spin">
          <img src={img2} alt="Dan Broe" />
        </section>
        <p>
          Dusty Cole's musical journey began at the tender age of eleven when
          his mother gifted him a vibrant purple six-string guitar. Little did
          he know, that simple gift would ignite a lifelong passion for music.
          At just thirteen years old, Dusty took to the stage for his very first
          gig, hosted by none other than Floyd Feske. It was here that Dusty
          discovered his voice and began honing his vocal skills.
        </p>
        <p>
          Fast forward two years, and Dusty finds himself immersed in the music
          scene, playing gigs regularly and using music as an outlet for
          self-expression. Despite his young age of fifteen in the year 2024,
          Dusty's dedication to his craft and unwavering spirits have propelled
          him to great heights in his musical journey.
        </p>
        <p>
          With each strum of his guitar and every note sung, Dusty Cole
          continues to captivate audiences with his soulful performances and
          infectious energy. As he embarks on his musical odyssey, Dusty remains
          steadfast in his pursuit of artistic excellence, leaving an indelible
          mark on the music world with his talent and unwavering passion.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default About;
