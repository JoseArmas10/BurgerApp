import React from "react";
import { Container, Row, Carousel } from "react-bootstrap";
// import User1 from "../../assets/blog/review-author-1.jpg"; // IMAGE MISSING
// import User2 from "../../assets/blog/review-author-2.jpg"; // IMAGE MISSING
// import User3 from "../../assets/blog/review-author-3.jpg"; // IMAGE MISSING
// import User4 from "../../assets/blog/review-author-5.jpg"; // IMAGE MISSING

function Section6() {
  return (
    <section className="blog_section">
      <Container>
        <Row>
          <Carousel>
            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  {/* <img src={User1} className="img-fluid" alt="User-1" /> */}
                  <div style={{width: '80px', height: '80px', backgroundColor: '#f8f9fa', margin: '0 auto 20px', borderRadius: '50%', border: '2px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#6c757d'}}>User 1</div>
                </div>
                <p>
                  " Etiam sapien sem at sagittis congue augue massa varius
                  sodales sapien undo tempus dolor egestas magna suscipit magna
                  tempus aliquet porta sodales augue suscipit luctus neque "
                </p>
                <div className="item_rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <h5>BY AMELIE NEWLOVE</h5>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  {/* <img src={User2} className="img-fluid" alt="User-2" /> */}
                  <div style={{width: '80px', height: '80px', backgroundColor: '#f8f9fa', margin: '0 auto 20px', borderRadius: '50%', border: '2px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#6c757d'}}>User 2</div>
                </div>
                <p>
                  " Etiam sapien sem at sagittis congue augue massa varius
                  sodales sapien undo tempus dolor egestas magna suscipit magna
                  tempus aliquet porta sodales augue suscipit luctus neque "
                </p>
                <div className="item_rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <h5>BY AMELIE NEWLOVE</h5>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  {/* <img src={User3} className="img-fluid" alt="User-3" /> */}
                  <div style={{width: '80px', height: '80px', backgroundColor: '#f8f9fa', margin: '0 auto 20px', borderRadius: '50%', border: '2px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#6c757d'}}>User 3</div>
                </div>
                <p>
                  " Etiam sapien sem at sagittis congue augue massa varius
                  sodales sapien undo tempus dolor egestas magna suscipit magna
                  tempus aliquet porta sodales augue suscipit luctus neque "
                </p>
                <div className="item_rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <h5>BY AMELIE NEWLOVE</h5>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  {/* <img src={User4} className="img-fluid" alt="User-4" /> */}
                  <div style={{width: '80px', height: '80px', backgroundColor: '#f8f9fa', margin: '0 auto 20px', borderRadius: '50%', border: '2px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#6c757d'}}>User 4</div>
                </div>
                <p>
                  " Etiam sapien sem at sagittis congue augue massa varius
                  sodales sapien undo tempus dolor egestas magna suscipit magna
                  tempus aliquet porta sodales augue suscipit luctus neque "
                </p>
                <div className="item_rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <h5>BY AMELIE NEWLOVE</h5>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Row>
      </Container>
    </section>
  );
}

export default Section6;
