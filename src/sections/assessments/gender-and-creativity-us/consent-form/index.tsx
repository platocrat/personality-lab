// Externals
import Link from 'next/link'
import { FC, Fragment } from 'react'
// Locals
import styles from '@/app/page.module.css'



type ConsentFormProps = {
  
}


const ConsentForm: FC<ConsentFormProps> = ({  }) => {
  // const title = `Consent Form`
  const href = `/gender-and-creativty-us/assessment`
  const buttonText = `Next`



  return (
    <Fragment key={ `gender-and-creativity-us-consent-form` }>
      <form
        action='https://genderandcreativityus.formr.org'
        method='post'
        // className='form-horizontal main_formr_survey'
        className={ styles.assessmentWrapper }
        encType='multipart/form-data'
        accept-charset='utf-8'
      >
        <input type='hidden' name='session_id' value='33541450' />
        <input
          type='hidden'
          name='_formr_request_tokens'
          value='ba3fdda93455ad6b22129c00bb8d89c427825ecd'
        />
        <input
          type='hidden'
          name='_formr_code'
          value='o8LfbSjS5oy7cIvnycS6TqmSLGE7u6eakDurUwRoUi_4OZOE2Vfs62cDLk4U-L0C'
        />
        <input type='hidden' name='_formr_cookie' value='' />

        <div
          className='row progress-container'
          style={ { width: '712px' } }
        >
          <div className='progress'>
            <div
              className='progress-bar'
              style={ { width: '11%' } }
              data-percentage-minimum='0'
              data-percentage-maximum='100'
              data-already-answered='1'
              data-items-left='0'
              data-items-on-page='8'
              data-hidden-but-rendered='0'
            >
              { `11%` }
            </div>
          </div>
        </div>

        <div className='form-group form-row optional item-note'>
          <div className='control-label'>
            <p>
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
            <p>
              You should not be physically located in China when participating in this
              study.
            </p>
            <p>
              { `Principal Investigator Name and Title: Brent Roberts, Professor` }
              <br />
              { `Department and Institution: Psychology, University of Illinois at
              Urbana-Champaign Contact Information: 217-333-2644;
              bwrobrts@illinois.edu` }
            </p>
            <p>
              <strong>What procedures are involved?</strong><br />
              { `You will be asked to complete questions about personality, interests,
              and creative achievements.` }
              <br />
              { `Your participation will last approximately 25 minutes on average.` }
            </p>
            <p>
              <strong>What are the potential risks and discomforts?</strong><br />
              { `Potential risks and discomforts are minimal and do not exceed those
              encountered in everyday computer/internet usage.` }
            </p>
            <p>
              {
                `Your participation in this research is voluntary. Your decision whether
              or not to participate will not affect your current or future dealings
              with the University of Illinois at Urbana-Champaign. If you decide to
              participate, you are free to withdraw at any time without affecting that
              relationship. However, by withdrawing from the study, you will not
              receive credit.`
              }
            </p>
            <p>
              <strong>
                Are there benefits to participating in the research?
              </strong>
              <br />
              { `We will provide feedback to you for a personality trait measure and an
              interest measure. This feedback will show you where you score in
              relation to other people on the same measures.` }
            </p>
            <p>
              <strong>
                Will my study-related information be kept confidential?
              </strong>
              <br />
              { `Faculty, staff, students, and others with permission or authority to see
              your study information will maintain its confidentiality to the extent
              permitted and required by laws and university policies. The names or
              personal identifiers of participants will not be published or presented.` }
            </p>
            <p>
              <strong>
                Will I be reimbursed for any expenses or paid for my participation in
                this research?
              </strong>
              <br />
              You will not be offered payment for being in this study.
            </p>
            <p>
              <strong
              >Will data collected from me be used for any other research?
              </strong>
              <br />
              { `Your de-identified information could be used for future research without
              additional informed consent.` }
            </p>
            <p>
              <strong>Who should I contact if I have questions?</strong>
              <br />
              { `If you have questions about this project, you may contact Brent Roberts
              at 217-333-2644 or` }
              <br />
              { `bwrobrts@illinois.edu, or you may contact Rodrigo Fabretti at
              217-418-7560 or rr27@illinois.edu.` }
              <br />
              { `If you have any questions about your rights as a participant in this
              study or any concerns or complaints, please contact the University of
              Illinois at Urbana-Champaign Office for the Protection of Research
              Subjects at 217-333-2670 or via email at irb@illinois.edu.` }
            </p>
            <p>
              <strong>
                { `General Data Protection Regulation (GDPR) Notice/Consent` }
              </strong>
              <br />
              { `The University of Illinois Web Privacy Notice and Supplemental Privacy
              Notice for certain persons in the European Economic Area and the United
              Kingdom describe in detail how the University processes personal
              information.` }
              <br />
              { `To assist in the analysis of our research, we ask in the following
              section certain questions about you. Some of the demographic questions
              pertain to special categories of personal information under Article 9 of
              the GDPR. As with all of the questions in the survey, answering the
              questions involving special categories of personal information is
              completely voluntary.` }
            </p>
            <p>
              { `The legal basis for collecting the special category personal information
              is consent, which you may withdraw at any time; however, doing so will
              not affect the processing of your personal information before your
              withdrawal of consent.` }
            </p>
            <p>
              <strong>
                { `I consent to the collection, use, retention (including through the
                use of cloud storage services hosted by third parties); and sharing
                with the research team of personal information concerning my:` }
              </strong>
            </p>
          </div>
          <div className='controls'>
            <div className='controls-inner'>
              <span>
                <input
                  type='hidden'
                  value='1'
                  name='consent'
                  className=''
                  id='item21280315'
                />
              </span>
            </div>
          </div>

          <span className='item-view-inputs'>
            <input
              className='item_shown'
              type='hidden'
              name='_item_views[shown][21280315]'
              value='2024-05-11 21:56:41'
            />
            <input
              className='item_shown_relative'
              type='hidden'
              name='_item_views[shown_relative][21280315]'
              value='559.3999999910593'
            />
            <input
              className='item_answered'
              type='hidden'
              name='_item_views[answered][21280315]'
            />
            <input
              className='item_answered_relative'
              type='hidden'
              name='_item_views[answered_relative][21280315]'
            />
          </span>

          <div className='hidden_debug_message hidden item_name'>
            <span className='badge hastooltip' title='' data-original-title=''>
              { `consent` }
            </span>
          </div>
        </div>

        <div
          className='form-group form-row optional label_align_left left500 mc_width80 item-mc'
        >
          <label className='control-label'> Racial or ethnic origin </label>
          <div className='controls'>
            <div className='controls-inner'>
              <div className='mc-table'>
                <input
                  type='hidden'
                  value=''
                  id='item21280316_'
                  name='consent_race'
                  className=''
                />

                <label className='radio-inline' htmlFor='item21280316_0'>
                  <input
                    id='item21280316_0'
                    value='0'
                    type='radio'
                    name='consent_race'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>No</span>
                </label>

                <label className='radio-inline' htmlFor='item21280316_1'>
                  <input
                    id='item21280316_1'
                    value='1'
                    type='radio'
                    name='consent_race'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>Yes</span>
                </label>
              </div>
            </div>
          </div>

          <span className='item-view-inputs'>
            <input
              className='item_shown'
              type='hidden'
              name='_item_views[shown][21280316]'
              value='2024-05-11 21:56:41'
            />
            <input
              className='item_shown_relative'
              type='hidden'
              name='_item_views[shown_relative][21280316]'
              value='559.3999999910593'
            />
            <input
              className='item_answered'
              type='hidden'
              name='_item_views[answered][21280316]'
            />
            <input
              className='item_answered_relative'
              type='hidden'
              name='_item_views[answered_relative][21280316]'
            />
          </span>

          <div className='hidden_debug_message hidden item_name'>
            <span className='badge hastooltip' title='' data-original-title=''>
              consent_race
            </span>
          </div>
        </div>

        <div
          className='form-group form-row optional label_align_left left500 mc_width80 item-mc'
        >
          <label className='control-label'> Political opinions </label>
          <div className='controls'>
            <div className='controls-inner'>
              <div className='mc-table'>
                <input
                  type='hidden'
                  value=''
                  id='item21280317_'
                  name='consent_political'
                  className=''
                />

                <label className='radio-inline' htmlFor='item21280317_0'>
                  <input
                    id='item21280317_0'
                    value='0'
                    type='radio'
                    name='consent_political'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>No</span>
                </label>

                <label className='radio-inline' htmlFor='item21280317_1'>
                  <input
                    id='item21280317_1'
                    value='1'
                    type='radio'
                    name='consent_political'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>Yes</span>
                </label>
              </div>
            </div>
          </div>

          <span className='item-view-inputs'>
            <input
              className='item_shown'
              type='hidden'
              name='_item_views[shown][21280317]'
              value='2024-05-11 21:56:41'
            />
            <input
              className='item_shown_relative'
              type='hidden'
              name='_item_views[shown_relative][21280317]'
              value='559.3999999910593'
            />
            <input
              className='item_answered'
              type='hidden'
              name='_item_views[answered][21280317]'
            />
            <input
              className='item_answered_relative'
              type='hidden'
              name='_item_views[answered_relative][21280317]'
            />
          </span>

          <div className='hidden_debug_message hidden item_name'>
            <span className='badge hastooltip' title='' data-original-title=''>
              consent_political
            </span>
          </div>
        </div>

        <div
          className='form-group form-row optional label_align_left left500 mc_width80 item-mc'
        >
          <label className='control-label'> Religious or philosophical beliefs </label>
          <div className='controls'>
            <div className='controls-inner'>
              <div className='mc-table'>
                <input
                  type='hidden'
                  value=''
                  id='item21280318_'
                  name='consent_relig_philo'
                  className=''
                />

                <label className='radio-inline' htmlFor='item21280318_0'>
                  <input
                    id='item21280318_0'
                    value='0'
                    type='radio'
                    name='consent_relig_philo'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>No</span>
                </label>

                <label className='radio-inline' htmlFor='item21280318_1'>
                  <input
                    id='item21280318_1'
                    value='1'
                    type='radio'
                    name='consent_relig_philo'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>Yes</span>
                </label>
              </div>
            </div>
          </div>

          <span className='item-view-inputs'>
            <input
              className='item_shown'
              type='hidden'
              name='_item_views[shown][21280318]'
              value='2024-05-11 21:56:41'
            />
            <input
              className='item_shown_relative'
              type='hidden'
              name='_item_views[shown_relative][21280318]'
              value='559.3999999910593'
            />
            <input
              className='item_answered'
              type='hidden'
              name='_item_views[answered][21280318]'
            />
            <input
              className='item_answered_relative'
              type='hidden'
              name='_item_views[answered_relative][21280318]'
            />
          </span>

          <div className='hidden_debug_message hidden item_name'>
            <span className='badge hastooltip' title='' data-original-title=''>
              consent_relig_philo
            </span>
          </div>
        </div>

        <div
          className='form-group form-row optional label_align_left left500 mc_width80 item-mc'
        >
          <label className='control-label'> Health data </label>
          <div className='controls'>
            <div className='controls-inner'>
              <div className='mc-table'>
                <input
                  type='hidden'
                  value=''
                  id='item21280319_'
                  name='consent_health'
                  className=''
                />

                <label className='radio-inline' htmlFor='item21280319_0'>
                  <input
                    id='item21280319_0'
                    value='0'
                    type='radio'
                    name='consent_health'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>No</span>
                </label>

                <label className='radio-inline' htmlFor='item21280319_1'>
                  <input
                    id='item21280319_1'
                    value='1'
                    type='radio'
                    name='consent_health'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>Yes</span>
                </label>
              </div>
            </div>
          </div>

          <span className='item-view-inputs'>
            <input
              className='item_shown'
              type='hidden'
              name='_item_views[shown][21280319]'
              value='2024-05-11 21:56:41'
            />
            <input
              className='item_shown_relative'
              type='hidden'
              name='_item_views[shown_relative][21280319]'
              value='559.3999999910593'
            />
            <input
              className='item_answered'
              type='hidden'
              name='_item_views[answered][21280319]'
            />
            <input
              className='item_answered_relative'
              type='hidden'
              name='_item_views[answered_relative][21280319]'
            />
          </span>

          <div className='hidden_debug_message hidden item_name'>
            <span className='badge hastooltip' title='' data-original-title=''>
              consent_health
            </span>
          </div>
        </div>

        <div
          className='form-group form-row optional label_align_left left500 mc_width80 item-mc'
        >
          <label className='control-label'>
            { `Data concerning a natural person's sex life or sexual orientation` }
          </label>
          <div className='controls'>
            <div className='controls-inner'>
              <div className='mc-table'>
                <input
                  type='hidden'
                  value=''
                  id='item21280320_'
                  name='consent_sexual'
                  className=''
                />

                <label className='radio-inline' htmlFor='item21280320_0'>
                  <input
                    id='item21280320_0'
                    value='0'
                    type='radio'
                    name='consent_sexual'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>No</span>
                </label>

                <label className='radio-inline' htmlFor='item21280320_1'>
                  <input
                    id='item21280320_1'
                    value='1'
                    type='radio'
                    name='consent_sexual'
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>Yes</span>
                </label>
              </div>
            </div>
          </div>

          <span className='item-view-inputs'>
            <input
              className='item_shown'
              type='hidden'
              name='_item_views[shown][21280320]'
              value='2024-05-11 21:56:41'
            />
            <input
              className='item_shown_relative'
              type='hidden'
              name='_item_views[shown_relative][21280320]'
              value='559.3999999910593'
            />
            <input
              className='item_answered'
              type='hidden'
              name='_item_views[answered][21280320]'
            />
            <input
              className='item_answered_relative'
              type='hidden'
              name='_item_views[answered_relative][21280320]'
            />
          </span>

          <div className='hidden_debug_message hidden item_name'>
            <span className='badge hastooltip' title='' data-original-title=''>
              consent_sexual
            </span>
          </div>
        </div>

        <div
          className='form-group form-row required answer_below_label answer_align_center mc_width80 item-mc'
        >
          <label className='control-label'>
            <p>
              {
                `I understand that even if I answered 'yes' to any or all of these questions, I may still choose not to answer the associated survey questions. However, if I answer 'no' to any or all of these questions but provide the information in the survey anyway, the conflict will be resolved by deleting my special category information.`
              }
            </p>
            <p>
              Please print this consent form if you would like to retain a copy for
              your records.
            </p>
            <p>
              I have read the above information. I have been given an opportunity to
              ask questions and my questions have been answered to my satisfaction. I
              agree to participate in this research.
            </p>
          </label>
          <div className='controls'>
            <div className='controls-inner'>
              <div className='mc-table'>
                <input
                  type='hidden'
                  value=''
                  id='item21280321_'
                  name='consent_conflicting'
                  className=''
                />

                <label
                  className='radio-inline'
                  htmlFor='item21280321_0'
                >
                  <input
                    id='item21280321_0'
                    value='0'
                    type='radio'
                    name='consent_conflicting'
                    required={ true }
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>No</span>
                </label>

                <label
                  className='radio-inline'
                  htmlFor='item21280321_1'
                >
                  <input
                    id='item21280321_1'
                    value='1'
                    type='radio'
                    name='consent_conflicting'
                    required={ true }
                    className=''
                  /><span className='circle'></span><span className='check'></span>
                  <span className='mc-span'>Yes</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </form>


      <div style={ { float: 'right' } }>
        <Link href={ href }>
          <button className={ styles.button } style={ { width: '80px' } }>
            { buttonText }
          </button>
        </Link>
      </div>
    </Fragment>
  )
}

export default ConsentForm