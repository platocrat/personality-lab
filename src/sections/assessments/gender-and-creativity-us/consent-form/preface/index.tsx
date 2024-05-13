import ExternalLink from '@/components/Anchors/ExternalLink'


export const paragraphSectionStyle = {
  margin: '0px 0px 24px 0px'
}



const Preface = () => {
  return (
    <>
      <div>
        <p style={ paragraphSectionStyle }>
          {
            `You are being asked to participate in a voluntary research study. The
              purpose of this study is to investigate gender differences in
              characteristics that are linked to creativity. Participating in this
              study will involve completing a survey, and your participation will last
              approximately 25 minutes on average. There are no risks related to this
              research beyond those encountered in daily life; benefits related to
              this research include contributing to research on personality science.
              You will also have the opportunity to receive feedback on several
              measures of personality that you complete.`
          }
        </p>
        <p style={ paragraphSectionStyle }>
          {
            `You should not be physically located in China when participating in this
              study.`
          }
        </p>
        <p style={ paragraphSectionStyle }>
          { `Principal Investigator Name and Title: Brent Roberts, Professor` }
          <br />
          {
            `Department and Institution: Psychology, University of Illinois at Urbana-Champaign`
          }
          <br />
          { `Contact Information: ` }
          <ExternalLink linkText={ `217-333-2644` } />

          { `; ` }

          <ExternalLink linkText={ `bwrobrts@illinois.edu` } />
        </p>
        <p style={ paragraphSectionStyle }>
          <strong>
            { `What procedures are involved?` }
          </strong>
          <br />
          {
            `You will be asked to complete questions about personality, interests, and creative achievements.`
          }
          <br />
          { `Your participation will last approximately 25 minutes on average.` }
        </p>
        <p style={ paragraphSectionStyle }>
          <strong>
            { `What are the potential risks and discomforts?` }
          </strong>
          <br />
          {
            `Potential risks and discomforts are minimal and do not exceed those encountered in everyday computer/internet usage.`
          }
        </p>
        <p style={ paragraphSectionStyle }>
          {
            `Your participation in this research is voluntary. Your decision whether or not to participate will not affect your current or future dealings with the University of Illinois at Urbana-Champaign. If you decide to participate, you are free to withdraw at any time without affecting that relationship. However, by withdrawing from the study, you will not receive credit.`
          }
        </p>
        <p style={ paragraphSectionStyle }>
          <strong>
            { `Are there benefits to participating in the research?` }
          </strong>
          <br />
          {
            `We will provide feedback to you for a personality trait measure and an interest measure. This feedback will show you where you score in relation to other people on the same measures.`
          }
        </p>
        <p style={ paragraphSectionStyle }>
          <strong>
            { `Will my study-related information be kept confidential?` }
          </strong>
          <br />
          {
            `Faculty, staff, students, and others with permission or authority to see your study information will maintain its confidentiality to the extent permitted and required by laws and university policies. The names or personal identifiers of participants will not be published or presented.`
          }
        </p>
        <p style={ paragraphSectionStyle }>
          <strong>
            {
              `Will I be reimbursed for any expenses or paid for my participation in this research?`
            }
          </strong>
          <br />
          You will not be offered payment for being in this study.
        </p>
        <p style={ paragraphSectionStyle }>
          <strong>
            { `Will data collected from me be used for any other research?` }
          </strong>
          <br />
          {
            `Your de-identified information could be used for future research without additional informed consent.`
          }
        </p>
        <p style={ paragraphSectionStyle }>
          <strong>
            { `Who should I contact if I have questions?` }
          </strong>
          <br />
          {
            `If you have questions about this project, you may contact Brent Roberts at `
          }
          <ExternalLink linkText={ `217-333-2644` } />
          { ` or ` }
          <ExternalLink linkText={ `bwrobrts@illinois.edu` } />
          { `, or you may contact Rodrigo Fabretti at ` }
          <ExternalLink linkText={ `217-418-7560` } />
          { ` or ` }
          <ExternalLink linkText={ `rr27@illinois.edu` } />
          { `.` }
          <br />
          {
            `If you have any questions about your rights as a participant in this study or any concerns or complaints, please contact the University of Illinois at Urbana-Champaign Office for the Protection of Research Subjects at `
          }
          <ExternalLink linkText={ `217-333-2670` } />
          { ` or via email at ` }
          <ExternalLink linkText={ `irb@illinois.edu` } />
          { `.` }
        </p>
        <p style={ paragraphSectionStyle }>
          <strong>
            { `General Data Protection Regulation (GDPR) Notice/Consent` }
          </strong>
          <br />
          {
            `The University of Illinois Web Privacy Notice and Supplemental Privacy Notice for certain persons in the European Economic Area and the United Kingdom describe in detail how the University processes personal information.`
          }
          <br />
          {
            `To assist in the analysis of our research, we ask in the following section certain questions about you. Some of the demographic questions pertain to special categories of personal information under Article 9 of the GDPR. As with all of the questions in the survey, answering the questions involving special categories of personal information is completely voluntary.`
          }
        </p>
        <p style={ paragraphSectionStyle }>
          {
            `The legal basis for collecting the special category personal information is consent, which you may withdraw at any time; however, doing so will not affect the processing of your personal information before your withdrawal of consent.`
          }
        </p>
        <p style={ paragraphSectionStyle }>
          <strong>
            {
              `I consent to the collection, use, retention (including through the use of cloud storage services hosted by third parties); and sharing with the research team of personal information concerning my:`
            }
          </strong>
        </p>
      </div>
    </>
  )
}


export default Preface