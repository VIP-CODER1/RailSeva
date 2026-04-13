
import React, { useState } from "react";
import axios from "axios"; // Import axios
import './complaintStatus.css'; // Make sure to include your CSS file
import { useTranslation } from 'react-i18next';

// Lets users look up a complaint and see its progress timeline.
export default function ComplaintStatus() {
  const { t } = useTranslation();
  const [complaintId, setComplaintId] = useState("");
  const [complaintData, setComplaintData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const statusSegments = [
    { label: t("ccomplaint.under_review"), color: "bg-warning", description: t("ccomplaint.under_review_description") },
    { label: t("ccomplaint.assigned"), color: "bg-primary", description: t("ccomplaint.assigned_description") },
    { label: t("ccomplaint.resolved"), color: "bg-success", description: t("ccomplaint.resolved_description") },
  ];

  // Returns true when a status step should be shown as completed.
  // Checks whether a timeline segment should appear completed.
  const isCompleted = (segmentLabel) => {
    const labels = statusSegments.map(seg => seg.label);
    return labels.indexOf(segmentLabel) <= labels.indexOf(complaintData?.status);
  };

  // Looks up complaint status details for the entered complaint ID.
  // Requests complaint status details from the backend using the entered ID.
  const fetchComplaintStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://localhost:8001/complaintstatus/${complaintId}`);
      setComplaintData(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      setComplaintData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row p-5" style={{ background: '#f0f7ff' }}>
        <div className="col-md-8 mx-auto">
          <h1 className="display-4 heading pb-2">{t('ccomplaint.status')}</h1>
          <p className="text-muted" style={{ fontSize: '3vh' }}>
            {t('ccomplaint.check_status')}
          </p>

          <form onSubmit={fetchComplaintStatus}>
            <div className="mb-3 text-start my-5" style={{ fontSize: '2.5vh' }}>
              <label htmlFor="complaint-id" className="form-label">
                {t('ccomplaint.complaint_id')}
              </label>
              <input
                type="text"
                id="complaint-id"
                className="form-control"
                placeholder={t('ccomplaint.enter_complaint_id')}
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading} style={{ background: '#71b0f4', border: 'none', color: 'black' }}>
              {loading ? t('common.loading') : t('ccomplaint.check_status')}
            </button>
          </form>

          {error && <p className="text-danger mt-3">{t(error)}</p>}

          {complaintData && (
            <div>
              <div className="mb-3 text-start mt-4">
                <label htmlFor="status" className="form-label" style={{ fontSize: '2.5vh' }}>
                  {t('ccomplaint.complaint_status')}
                </label>
                <div className="position-relative my-2 py-2 pb-3">
                  <div className="timeline">
                    {statusSegments.map((segment, index) => (
                      <div key={index} className="timeline-item d-flex align-items-start">
                        <div
                          className={`timeline-icon ${isCompleted(segment.label) ? segment.color : 'bg-secondary'} me-3`}
                        ></div>
                        <div className="timeline-content">
                          <h5 className="font-weight-bold">{segment.label}</h5>
                          <p>{segment.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-3 mt-3 py-3 rounded-4" style={{ border: '2px solid gray ' }}>
                <label htmlFor="complaint-details" className="form-label">
                  {t('ccomplaint.complaint_details')}
                </label>
                <p>
                  <strong>{t('ccomplaint.train_no')}</strong> {complaintData.trainNo}
                </p>
                <p>
                  <strong>{t('ccomplaint.pnr_no')}</strong> {complaintData.pnrNo}
                </p>
                <p>
                  <strong>{t('ccomplaint.coach_no')}</strong> {complaintData.coachNo}
                </p>
                <p>
                  <strong>{t('ccomplaint.seat_no')}</strong> {complaintData.seatNo}
                </p>
                <p>
                  <strong>{t('ccomplaint.department')}</strong> {complaintData.department}
                </p>
              </div>

              <div className="mb-3 mt-3">
                <label htmlFor="feedback" className="form-label">
                  {t('ccomplaint.feedback')}
                </label>
                <textarea
                  id="feedback"
                  className="form-control"
                  rows="4"
                  placeholder={t('ccomplaint.feedback_placeholder')}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100" style={{ background: '#71b0f4', border: 'none', color: 'black' }}>
                {t('ccomplaint.submit_feedback')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
