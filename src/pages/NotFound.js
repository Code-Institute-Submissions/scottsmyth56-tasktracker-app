import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
const NotFoundPage = () => {
  return (
    <div style={{marginTop:20}}>
      <Container className="my-100 text-white">
        <Row className="justify-content-center m-0">
          <Col xs={12} md={6} lg={4}>
            <h1>404 - Not Found!</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <p>
              You can always go back to the <Link to="/" style={{textDecoration:"underline", color:"white"}}>homepage</Link>.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFoundPage;
