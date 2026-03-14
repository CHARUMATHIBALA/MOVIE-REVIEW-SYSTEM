
import React from "react";

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>MovieReview is your premier destination for honest and comprehensive movie reviews. We help you discover the best films across all genres.</p>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@moviereview.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Movie Lane, Hollywood, CA 90028</p>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link">f</a>
            <a href="#" className="social-link">t</a>
            <a href="#" className="social-link">i</a>
            <a href="#" className="social-link">y</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Movie Review System. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
