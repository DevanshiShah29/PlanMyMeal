import { useState, useEffect } from 'react';

// Library Imports
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Empty, message, Spin } from 'antd';

// Helper Imports
import api from '../../utils/api';

export default function FactsPage() {
  const [expanded, setExpanded] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        setLoading(true);
        const data = await api('/facts', { method: 'GET' });
        setFaqs(data);
      } catch (error) {
        message.error(`Failed to fetch: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  function formatAnswer(text) {
    if (!text || typeof text !== 'string') return null;

    const lines = text.split('\n').filter((line) => line.trim() !== '');

    return lines.map((line, index) => (
      <p className="disc" key={index}>
        {parseLinks(line.trim())}
      </p>
    ));
  }
  function parseLinks(text) {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);

    return parts.map((part, index) => {
      if (/^https?:\/\/[^\s]+$/.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="highlighted-link">
            {part}
          </a>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  }

  return (
    <div id="factsWrapper">
      <h1 className="pageDescription">Facts</h1>
      <Spin spinning={loading} size="large" className="loader">
        {Array.isArray(faqs) && faqs.length > 0 ? (
          faqs.map((item) => (
            <MuiAccordion
              className="accordion"
              expanded={expanded === `panel${item._id}`}
              onChange={handleChange(`panel${item._id}`)}
              key={item._id}
            >
              <MuiAccordionSummary aria-controls={`panel${item._id}d-content`} id={`panel${item._id}d-header`}>
                <Typography className="accordion-title">{item.question}</Typography>
                <ExpandMoreIcon />
              </MuiAccordionSummary>

              <MuiAccordionDetails className="accordion-content">
                <Typography component="div">{formatAnswer(item.answer)}</Typography>
              </MuiAccordionDetails>
            </MuiAccordion>
          ))
        ) : (
          <div className="emptyWrapper">
            <Empty description="No FAQs Found" />
          </div>
        )}
      </Spin>
    </div>
  );
}
