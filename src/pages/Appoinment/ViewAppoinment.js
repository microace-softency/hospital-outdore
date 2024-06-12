import * as React from "react";
import Box from "@mui/joy/Box";
import {
  AspectRatio,
  Button,
  Card,
  CardActions,
  CardOverflow,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  mobilenumber: "",
  name: "",
  location: "",
  age: "",
  symptomsdescription: "",
  durationofsymptoms: "",
  medicalhistory: "",
  medications: "",
  allergies: "",
  previoustreatments: "",
  frequencyandintensity: "",
  associatedfactors: "",
  emergencycontactname: "",
  emergencycontactphone: "",
  additionalcomments: "",
};

export default function ViewAppoinment() {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const {
    mobilenumber,
    name,
    location,
    age,
    symptomsdescription,
    durationofsymptoms,
    medicalhistory,
    medications,
    allergies,
    previoustreatments,
    frequencyandintensity,
    associatedfactors,
    emergencycontactname,
    emergencycontactphone,
    additionalcomments,
  } = state;
  const { id } = useParams();

  //   useEffect(() => {
  //     axios
  //       .get(`http://localhost:3002/api/class/${id}`)
  //       .then((resp) => setState({ ...resp.data[0] }));
  //   }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !mobilenumber ||
      !name ||
      !location ||
      !age ||
      !symptomsdescription ||
      !durationofsymptoms ||
      !durationofsymptoms ||
      !medicalhistory ||
      !allergies ||
      !previoustreatments ||
      !frequencyandintensity ||
      !associatedfactors ||
      !emergencycontactname ||
      !emergencycontactphone ||
      !additionalcomments
    ) {
      toast.error("Please provide value into each inpute field ");
    } else {
      if (!id) {
        axios
          .post("http://localhost:8005/api/createappointment", {
            mobilenumber,
            name,
            location,
            age,
            symptomsdescription,
            durationofsymptoms,
            medicalhistory,
            medications,
            allergies,
            previoustreatments,
            frequencyandintensity,
            associatedfactors,
            emergencycontactname,
            emergencycontactphone,
            additionalcomments,
          })
          .then(() => {
            setState({
              mobilenumber: "",
              name: "",
              location: "",
              age: "",
              symptomsdescription: "",
              durationofsymptoms: "",
              medicalhistory: "",
              medications: "",
              allergies: "",
              previoustreatments: "",
              frequencyandintensity: "",
              associatedfactors: "",
              emergencycontactname: "",
              emergencycontactphone: "",
              additionalcomments: "",
            });
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("Appointment  Successfully");
      } else {
        axios
          .put(`http://localhost:8005/api/createappointment/${id}`, {
            mobilenumber,
            name,
            location,
            age,
            symptomsdescription,
            durationofsymptoms,
            medicalhistory,
            medications,
            allergies,
            previoustreatments,
            frequencyandintensity,
            associatedfactors,
            emergencycontactname,
            emergencycontactphone,
            additionalcomments,
          })
          .then(() => {
            setState({
              mobilenumber: "",
              name: "",
              location: "",
              age: "",
              symptomsdescription: "",
              durationofsymptoms: "",
              medicalhistory: "",
              medications: "",
              allergies: "",
              previoustreatments: "",
              frequencyandintensity: "",
              associatedfactors: "",
              emergencycontactname: "",
              emergencycontactphone: "",
              additionalcomments: "",
            });
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("update Successfully");
      }
      setTimeout(() => navigate("/appoinment"), 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <Box sx={{ flex: 1, width: "100%", marginTop: "3vh" }}>
      <Button
        style={{ display: "flex" }}
        onClick={() => navigate("/appoinment")}
      >
        {"<"}
      </Button>
      <form onSubmit={handleSubmit}>
        {/* <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}> */}
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Appoinment Details</Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "block", md: "flex" }, my: 1 }}
          >
            <Stack direction="column" spacing={1}></Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormLabel>Mobile No</FormLabel>
                <FormControl
                  sx={{
                    display: { sm: "flex-column", md: "flex-row" },
                    gap: 2,
                  }}
                >
                  <Input
                    size="sm"
                    placeholder="Mobile No"
                    type="number"
                    id="mobilenumber"
                    name="mobilenumber"
                    value={mobilenumber || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    size="sm"
                    type="Name"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Class Name"
                    sx={{ flexGrow: 1 }}
                    id="name"
                    name="name"
                    value={name || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Location</FormLabel>
                  <Input
                    size="sm"
                    type="Name"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="location"
                    sx={{ flexGrow: 1 }}
                    id="location"
                    name="location"
                    value={location || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Age</FormLabel>
                  <Input
                    size="sm"
                    type="Name"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Age"
                    sx={{ flexGrow: 1 }}
                    id="age"
                    name="age"
                    value={age || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Symptoms Description</FormLabel>
                  <Input
                    size="sm"
                    type="Name"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Class Name"
                    sx={{ flexGrow: 1 }}
                    id="symptomsdescription"
                    name="symptomsdescription"
                    value={symptomsdescription || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Duration of Symptoms</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Class Name"
                    sx={{ flexGrow: 1 }}
                    id="durationofsymptoms"
                    name="durationofsymptoms"
                    value={durationofsymptoms || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Medicalhistory</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Medicalhistory"
                    sx={{ flexGrow: 1 }}
                    id="medicalhistory"
                    name="medicalhistory"
                    value={medicalhistory || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Medications</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Medications"
                    sx={{ flexGrow: 1 }}
                    id="medications"
                    name="medications"
                    value={medications || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Allergies</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Allergies"
                    sx={{ flexGrow: 1 }}
                    id="allergies"
                    name="allergies"
                    value={allergies || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Previous Treatments</FormLabel>
                  <Input
                    size="sm"
                    type="previoustreatments"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Previous Treatments"
                    sx={{ flexGrow: 1 }}
                    id="previoustreatments"
                    name="previoustreatments"
                    value={previoustreatments || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Frequency and Intensity</FormLabel>
                  <Input
                    size="sm"
                    type="frequencyandintensity"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Frequency and Intensity"
                    sx={{ flexGrow: 1 }}
                    id="frequencyandintensity"
                    name="frequencyandintensity"
                    value={frequencyandintensity || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Associated Factors</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="associatedfactors"
                    sx={{ flexGrow: 1 }}
                    id="associatedfactors"
                    name="associatedfactors"
                    value={associatedfactors || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Emergency Contact Name</FormLabel>
                  <Input
                    size="sm"
                    type="emergencycontactname"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Emergency Contact Name"
                    sx={{ flexGrow: 1 }}
                    id="emergencycontactname"
                    name="emergencycontactname"
                    value={emergencycontactname || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Emergency Contact Phone</FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Emergency Contact phone"
                    sx={{ flexGrow: 1 }}
                    id="emergencycontactphone"
                    name="emergencycontactphone"
                    value={emergencycontactphone || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Additional Comments</FormLabel>
                  <Input
                    size="sm"
                    type="additionalcomments"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Additional Comments"
                    sx={{ flexGrow: 1 }}
                    id="additionalcomments"
                    name="additionalcomments"
                    value={additionalcomments || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
              <Button
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={() => navigate("/appoinment")}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="solid">
                {id ? "update" : "save"}
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
        {/* <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Appoinment Details</Typography>
          </Box>
          <Divider/>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'block', md: 'flex' }, my: 1 }}
          >
            <Stack direction="column" spacing={1}>
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormLabel>Mobile No</FormLabel>
                <FormControl
                  sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                >
                  <Input 
                  size="sm" 
                  placeholder="Mobile No"
                  type="number"
                  id="mobilenumber"
                  name="mobilenumber"
                  value={mobilenumber || ""}
                  onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    size="sm"
                    type="Name"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Class Name"
                    sx={{ flexGrow: 1 }}
                    id="name"
                    name="name"
                    value={name || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Location</FormLabel>
                  <Input
                    size="sm"
                    type="Name"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="location"
                    sx={{ flexGrow: 1 }}
                    id="location"
                    name="location"
                    value={location || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Age</FormLabel>
                  <Input
                    size="sm"
                    type="Name"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Age"
                    sx={{ flexGrow: 1 }}
                    id="age"
                    name="age"
                    value={age || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Symptoms Description</FormLabel>
                  <Input
                    size="sm"
                    type="Name"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Class Name"
                    sx={{ flexGrow: 1 }}
                    id="symptomsdescription"
                    name="symptomsdescription"
                    value={symptomsdescription || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Duration of Symptoms</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Class Name"
                    sx={{ flexGrow: 1 }}
                    id="durationofsymptoms"
                    name="durationofsymptoms"
                    value={durationofsymptoms || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Medicalhistory</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Medicalhistory"
                    sx={{ flexGrow: 1 }}
                    id="medicalhistory"
                    name="medicalhistory"
                    value={medicalhistory || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Medications</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Medications"
                    sx={{ flexGrow: 1 }}
                    id="medications"
                    name="medications"
                    value={medications || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Allergies</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Allergies"
                    sx={{ flexGrow: 1 }}
                    id="allergies"
                    name="allergies"
                    value={allergies || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Previous Treatments</FormLabel>
                  <Input
                    size="sm"
                    type="previoustreatments"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Previous Treatments"
                    sx={{ flexGrow: 1 }}
                    id="previoustreatments"
                    name="previoustreatments"
                    value={previoustreatments || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Frequency and Intensity</FormLabel>
                  <Input
                    size="sm"
                    type="frequencyandintensity"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Frequency and Intensity"
                    sx={{ flexGrow: 1 }}
                    id="frequencyandintensity"
                    name="frequencyandintensity"
                    value={frequencyandintensity || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Associated Factors</FormLabel>
                  <Input
                    size="sm"
                    type="text"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="associatedfactors"
                    sx={{ flexGrow: 1 }}
                    id="associatedfactors"
                    name="associatedfactors"
                    value={associatedfactors || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Emergency Contact Name</FormLabel>
                  <Input
                    size="sm"
                    type="emergencycontactname"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Emergency Contact Name"
                    sx={{ flexGrow: 1 }}
                    id="emergencycontactname"
                    name="emergencycontactname"
                    value={emergencycontactname || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Emergency Contact Phone</FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Emergency Contact phone"
                    sx={{ flexGrow: 1 }}
                    id="emergencycontactphone"
                    name="emergencycontactphone"
                    value={emergencycontactphone || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Additional Comments</FormLabel>
                  <Input
                    size="sm"
                    type="additionalcomments"
                    // startDecorator={<EmailRoundedIcon />}
                    placeholder="Additional Comments"
                    sx={{ flexGrow: 1 }}
                    id="additionalcomments"
                    name="additionalcomments"
                    value={additionalcomments || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral" onClick={()=>navigate('/appoinment')}>
                Cancel
              </Button>
              <Button type='submit' size="sm" variant="solid">
                { id ? "update" : "save"}
              </Button>
            </CardActions>
          </CardOverflow>
        </Card> */}
        {/* </div> */}
      </form>
    </Box>
  );
}
