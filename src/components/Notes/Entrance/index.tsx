import styles from '@/app/page.module.css'


const EntranceNote = ({ }) => {
  return (
    <>
      <div style={{ margin: '28px 0px -8px 0px' }}>
        <p className={ styles.entranceNote }>
          { `Please note that we do not store any information from these assessments` }
        </p>
      </div>
    </>
  )
}


export default EntranceNote