import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { faqs } from '../constant/FAQs';

export default function Facts() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const detectUrls = (data) => {
    return data.includes('\n')
      ? data.split('\n').map((desc, index) => {
          const key = index + 1;
          const parts = desc.split(/(https?:\/\/[^\s]+)/);
          const elements = parts.map((part) =>
            /^https?:\/\/[^\s]+$/i.test(part) ? (
              <a key={key} href={part} target="_blank" rel="noopener noreferrer">
                {part}
              </a>
            ) : (
              part
            ),
          );
          return (
            <p key={key} className="disc">
              {elements}
            </p>
          );
        })
      : data;
  };
  return (
    <div id="factsWrapper">
      <p className="pageDescription">Facts</p>
      {faqs.map((item) => {
        return (
          <MuiAccordion
            className="accordion"
            expanded={expanded === `panel${item.id}`}
            onChange={handleChange(`panel${item.id}`)}
          >
            <MuiAccordionSummary aria-controls={`panel${item.id}d-content`} id={`panel${item.id}d-header`}>
              <Typography className="accordion-title">{item.question}</Typography>
              <ExpandMoreIcon />
            </MuiAccordionSummary>
            <MuiAccordionDetails className="accordion-content">{detectUrls(item.answer)}</MuiAccordionDetails>
          </MuiAccordion>
        );
      })}
    </div>
  );
}
