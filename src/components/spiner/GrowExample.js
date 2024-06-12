import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function GrowExample() {
  return (
    <>
      <Button variant="secondary" size='lg' disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Loading...
      </Button>
    </>
  );
}

export default GrowExample;