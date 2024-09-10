import React from 'react';
import { Link } from 'react-router-dom';
import { Section as SectionProp } from "../typescript/components";
import { useNavigate } from "react-router-dom";
// import Personalization from "@contentstack/personalization-sdk-js";
import { getuserIdCookie } from "../helper";
import {analytics} from "../utils/segment-analytics"

export default function Section({ section, entryUrl }: {section : SectionProp,  entryUrl: string;}) {
  const history = useNavigate();
  const isAboutUsPage = entryUrl === "/about-us";
  const onClickCTA = () => {
    // Personalization.triggerEvent(process.env.REACT_APP_PERSONALIZATION_AB_EVENT_NAME ?? 'click')
    analytics.track(process.env.REACT_APP_PERSONALIZATION_AB_EVENT_NAME ?? 'click', {
      userId: getuserIdCookie()
    });
    history("/");
  };

  function contentSection() {
    return (
      <div className='home-content' key='section-1'>
        {section.title_h2 && <h2 {...section.$?.title_h2 as {}}>{section.title_h2}</h2>}
        {section.description && <p {...section.$?.description as {}}>{section.description}</p>}
        {section.call_to_action.title && section.call_to_action.href ? ((
          isAboutUsPage ? ( <button onClick={onClickCTA} className='btn secondary-btn'>
              {section.call_to_action.title}
            </button>) : 
          (<Link {...section.call_to_action.$?.title as {}}
          to={section.call_to_action.href}
          className='btn secondary-btn'>
            {section.call_to_action.title}
          </Link>)
        )) : (
          ''
        )}
      </div>
    );
  }

  function imageContent() {
    return <img {...section.image.$?.url as {}} src={section.image.url} alt={section.image.filename} key='section-2' />;
  }
  return <div className='home-advisor-section'>{section.image_alignment === 'Left' ? [imageContent(), contentSection()] : [contentSection(), imageContent()]}</div>;
}
