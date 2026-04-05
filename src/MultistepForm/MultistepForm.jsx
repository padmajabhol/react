import { useState } from "react";

const STEPS = 3;

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});


  const validate = () => {
    const newError = {};
    if ((step === 1) && !formData.name.trim()) {
      newError.name = "Name is required"
    }

    if ((step === 1) && !formData.email.trim()) {
      newError.email = "Email is required"
    }

    if ((step === 2) && !formData.password.trim()) {
      newError.password = "Password is required"
    }

    return newError;
  };

  const handleNext = () => {
    const validationError = validate();
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
    } else {
      setStep((prev) => prev + 1)
      setErrors({})
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1)
  };

  const handleSubmit = (e) => {
    // console.log formData
    e.preventDefault();
    console.log(formData.name, formData.email)
  };

  return (
    <div>
      <p>Step {step} of {STEPS}</p>
      {/* render step content */}
      {/* render navigation buttons */}
      {step === 1 && (
        <div>
          <div>
          <label>Name</label>
            <input value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
            {errors.name && (<p>{errors.name}</p>)}
          </div>
          <div>
          <label>Email</label>
            <input value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
            {errors.email && (<p>{errors.email}</p>)}
          </div>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <div>
            <label>Password</label>
            <input value={formData.password} onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))} />
            {errors.password && (<p>{errors.password}</p>)}
          </div>
          <button onClick={handleBack}>
            Back
          </button>
          <button onClick={handleNext}>
            Next
          </button>
        </div>
      )}
      {step === 3 && (
        <div>
          <div>
            <p>{formData.name}</p>
            <p>{formData.email}</p>
          </div>
          <button onClick={handleBack}>
            Back
          </button>
          <button onClick={(e) => handleSubmit(e)}>
            Submit
          </button>
        </div>
        
      )}
    </div>
  );
}