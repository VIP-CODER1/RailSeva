
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-bootstrap';

// Renders the complaint form and handles OCR-assisted complaint submission.
function ComplaintForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    trainNo: '',
    pnrNo: '',
    seatNo: '',
    coachNo: '',
    trainName: '',
    currentLocation: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [ticketImage, setTicketImage] = useState(null);
  const [ocrData, setOcrData] = useState({ pnrNo: '', trainNo: '', coachNo: '', seatNo: '' });

  // Auto-fills train details when a known train number is entered.
  useEffect(() => {
    // Automatically set train name and location when train number is filled
    if (formData.trainNo === '12426') { // Use your specific train number here
      setFormData((prevFormData) => ({
        ...prevFormData,
        trainName: 'New Delhi Rajdhani Express',
        currentLocation: 'Kathua',
      }));
    }
  }, [formData.trainNo]);

  // Stores the selected ticket image so it can be sent to the OCR endpoint.
  // Stores the selected ticket image for OCR processing.
  const handleTicketImageChange = (e) => {
    setTicketImage(e.target.files[0]);
  };

  // Uploads the ticket image to the OCR service and copies extracted fields into the form.
  // Sends the ticket image to the OCR service and copies extracted fields into state.
  const handleUploadTicket = async () => {
    if (!ticketImage) {
      setMessage('Please upload a ticket image.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ticketImage', ticketImage);

      const response = await fetch(`${process.env.REACT_APP_ML_URL}/ocr-image`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setOcrData({
          pnrNo: data.pnrNo || '',
          trainNo: data.trainNo || '',
          coachNo: data.coachNo || '',
          seatNo: data.seatNo || '',
        });
        setFormData((prevFormData) => ({
          ...prevFormData,
          pnrNo: data.pnrNo || '',
          trainNo: data.trainNo || '',
          coachNo: data.coachNo || '',
          seatNo: data.seatNo || '',
        }));
        setMessage('Ticket data extracted successfully!');
      } else {
        setMessage('Failed to process ticket image. Please enter details manually.');
      }
    } catch (error) {
      setMessage('Error while uploading the image. Please try again.');
    }
  };

  // Updates a single form field as the user types.
  // Updates the controlled form fields as the user types.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Stores the complaint media file selected by the user.
  // Stores the complaint attachment selected by the user.
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Sends the complaint payload and attached media to the backend.
  // Submits the complaint payload and attachment to the backend.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('trainNo', ocrData.trainNo || formData.trainNo);
    form.append('pnrNo', ocrData.pnrNo || formData.pnrNo);
    form.append('seatNo', ocrData.seatNo || formData.seatNo);
    form.append('coachNo', ocrData.coachNo || formData.coachNo);
    form.append('trainName', formData.trainName || formData.trainName); 
    form.append('currentLocation', formData.currentLocation || formData.currentLocation);
    if (file) {
      form.append('file', file);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/upload-media`, {
        method: 'POST',
        body: form,
       
      });
      if (response.ok) {
        const responseData = await response.json();
        setMessage(
          responseData.url
            ? `Complaint submitted successfully! File URL: ${responseData.url}`
            : 'Complaint submitted successfully!'
        );
        setError('');
      } else {
        const errorData = await response.json();  // Check for more details from the server
        setError(`An error occurred: ${errorData.error || errorData.message || 'Unknown error'}`);
        setMessage('');
      }
    } catch (err) {
      setError('An error occurred while submitting the complaint. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center text-start">
        <div className="col-md-8">
          <h1 className="card-title mb-1 text-center" style={{ fontSize: '3rem' }}>
            {t('complaint.file_complaint')}
          </h1>
          <div className="card shadow-lg border-0 rounded-3" style={{ background: '#f0f7ff' }}>
            <div className="card-body p-5">
              <p className="text-muted">{t('complaint.help_resolve')}</p>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="ticketImage" className="form-label">
                    {t('complaint.upload_ticket_image')}
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      name="ticketImage"
                      id="ticketImage"
                      className="form-control"
                      style={{ borderRadius: '10px', borderColor: '#71b0f4' }}
                      onChange={handleTicketImageChange}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      style={{ border: 'none' }}
                      onClick={handleUploadTicket}
                    >
                      <i className="bi bi-upload"></i>
                    </button>
                  </div>
                  <small className="text-muted">{t('complaint.ai_analysis')}</small>
                </div>

                <div className="mb-3">
                  <label htmlFor="media" className="form-label">{t('complaint.attach_media')}</label>
                  <div className="input-group">
                    <input
                      type="file"
                      name="file"
                      id="media"
                      className="form-control"
                      style={{ borderRadius: '10px', borderColor: '#71b0f4' }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">{t('complaint.journey_details')}</label>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="trainNumber" className="form-label">
                          {t('complaint.train_number')}
                        </label>
                        <input
                          type="text"
                          id="trainNumber"
                          name="trainNo"
                          className="form-control"
                          placeholder={t('complaint.enter_train_number')}
                          style={{ borderRadius: '10px', borderColor: '#71b0f4' }}
                          value={formData.trainNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="pnr" className="form-label">
                          {t('complaint.pnr')}
                        </label>
                        <input
                          type="text"
                          id="pnr"
                          name="pnrNo"
                          className="form-control"
                          placeholder={t('complaint.enter_pnr')}
                          style={{ borderRadius: '10px', borderColor: '#71b0f4' }}
                          value={formData.pnrNo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="CoachNumber" className="form-label">
                          {t('class')}
                        </label>
                        <input
                          type="text"
                          id="CoachNumber"
                          name="coachNo"
                          className="form-control"
                          placeholder={t('complaint.enter_coach_number')}
                          style={{ borderRadius: '10px', borderColor: '#71b0f4' }}
                          value={formData.coachNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="SeatNumber" className="form-label">
                          {t('complaint.seat_number')}
                        </label>
                        <input
                          type="text"
                          id="SeatNumber"
                          name="seatNo"
                          className="form-control"
                          placeholder={t('complaint.enter_seat_number')}
                          style={{ borderRadius: '10px', borderColor: '#71b0f4' }}
                          value={formData.seatNo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="trainName" className="form-label">
                          {t('complaint.train_name')}
                        </label>
                        <input
                          type="text"
                          id="trainName"
                          name="trainName"
                          className="form-control"
                          placeholder={t('complaint.enter_train_name')}
                          style={{ borderRadius: '10px', borderColor: '#71b0f4' }}
                          value={formData.trainName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="location" className="form-label">
                          {t('complaint.current_location')}
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="currentLocation"
                          className="form-control"
                          placeholder={t('complaint.enter_current_location')}
                          style={{ borderRadius: '10px', borderColor: '#71b0f4' }}
                          value={formData.currentLocation}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 mt-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    style={{ backgroundColor: '#71b0f4', borderColor: '#71b0f4' }}
                  >
                    {t('complaint.submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintForm;
