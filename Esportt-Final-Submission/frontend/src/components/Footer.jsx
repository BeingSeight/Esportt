'use client'; 

import styles from './Footer.module.css';
import { CgFacebook } from "react-icons/cg";
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import { SlArrowUp } from "react-icons/sl";
import LiquidButton from './LiquidButton';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.contentContainer}>
        <h2 className={styles.textLogo}>EsportTT</h2>
        <p className={styles.tagline}>
          ISU Sprint-3 Project for Dynamic Game Tutorial Personalizer
        </p>

        <LiquidButton />

      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>© Being Seight All Rights Reserved [Only for Educational Purposes]</p>
        <SlArrowUp onClick={scrollToTop} className={styles.arrowUp} />
      </div>

     
    </footer>
  );
}