import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { State } from "country-state-city";

const EditJobModal = ({ job, jobCategories = [], jobTypes = [], onUpdateJob, onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        jobType: "",
        jobCategory: "",
        salaryType: "",
        minSalary: "",
        maxSalary: "",
        skills: "",
        qualifications: "",
        experience: "",
        industry: "",
        address: "",
        city: "",
        state: "",
        posted_eid: null
    });

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || "",
                description: job.description || "",
                jobType: job.jobTypeEntity ? job.jobTypeEntity.jobTypeId : "",
                jobCategory: job.jobCategoryEntity ? job.jobCategoryEntity.jobCategoryId : "",
                salaryType: job.salaryType || "",
                minSalary: job.minSalary || "",
                maxSalary: job.maxSalary || "",
                skills: job.skills || "",
                qualifications: job.qualifications || "",
                experience: job.experience || "",
                industry: job.industry || "",
                address: job.address || "",
                city: job.city || "",
                state: job.state || "",
                posted_eid: job.enterprise ? job.enterprise.eid : null
            });
        }
    }, [job]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateJob({ ...job, ...formData });
    };

    const states = State.getStatesOfCountry("VN"); // Lấy danh sách các tỉnh của Việt Nam

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="title">
                        <Form.Label>Job Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter job title"
                        />
                    </Form.Group>
                    <Form.Group controlId="description" className="mt-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter job description"
                        />
                    </Form.Group>
                    <Form.Group controlId="jobType" className="mt-3">
                        <Form.Label>Job Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                        >
                            <option value="">Select Job Type</option>
                            {jobTypes.length > 0 && jobTypes.map((type) => (
                                <option key={type.jobTypeId} value={type.jobTypeId}>
                                    {type.jobTypeName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="jobCategory" className="mt-3">
                        <Form.Label>Job Category</Form.Label>
                        <Form.Control
                            as="select"
                            name="jobCategory"
                            value={formData.jobCategory}
                            onChange={handleChange}
                        >
                            <option value="">Select Job Category</option>
                            {jobCategories.length > 0 && jobCategories.map((category) => (
                                <option key={category.jobCategoryId} value={category.jobCategoryId}>
                                    {category.jobCategoryName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="salaryType" className="mt-3">
                        <Form.Label>Salary Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="salaryType"
                            value={formData.salaryType}
                            onChange={handleChange}
                        >
                            <option value="">Select Salary Type</option>
                            <option value="hourly">Hourly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="minSalary" className="mt-3">
                        <Form.Label>Minimum Salary</Form.Label>
                        <Form.Control
                            type="number"
                            name="minSalary"
                            value={formData.minSalary}
                            onChange={handleChange}
                            placeholder="Enter minimum salary"
                        />
                    </Form.Group>
                    <Form.Group controlId="maxSalary" className="mt-3">
                        <Form.Label>Maximum Salary</Form.Label>
                        <Form.Control
                            type="number"
                            name="maxSalary"
                            value={formData.maxSalary}
                            onChange={handleChange}
                            placeholder="Enter maximum salary"
                        />
                    </Form.Group>
                    <Form.Group controlId="skills" className="mt-3">
                        <Form.Label>Skills</Form.Label>
                        <Form.Control
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="Enter required skills"
                        />
                    </Form.Group>
                    <Form.Group controlId="qualifications" className="mt-3">
                        <Form.Label>Qualifications</Form.Label>
                        <Form.Control
                            type="text"
                            name="qualifications"
                            value={formData.qualifications}
                            onChange={handleChange}
                            placeholder="Enter required qualifications"
                        />
                    </Form.Group>
                    <Form.Group controlId="experience" className="mt-3">
                        <Form.Label>Experience</Form.Label>
                        <Form.Control
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Enter required experience"
                        />
                    </Form.Group>
                    <Form.Group controlId="industry" className="mt-3">
                        <Form.Label>Industry</Form.Label>
                        <Form.Control
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            placeholder="Enter industry"
                        />
                    </Form.Group>
                    <Form.Group controlId="address" className="mt-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                        />
                    </Form.Group>
                    <Form.Group controlId="city" className="mt-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                        />
                    </Form.Group>
                    <Form.Group controlId="state" className="mt-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                            as="select"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            <option value="">Select State</option>
                            {states.length > 0 && states.map((state) => (
                                <option key={state.isoCode} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditJobModal;
