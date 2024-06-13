'use client'

// Externals
import { FC, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
import HistoricalAssessments from '@/sections/profile/historical-assessments'
import ChartjsHistoricalAssessments from '@/sections/profile/historical-assessments/chartjs-line-chart'
// Sections
// Hooks
import useAccount from '@/hooks/useAccount'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import sectionStyles from '@/sections/profile/Profile.module.css'


type ProfileProps = {

}



const Profile: FC<ProfileProps> = ({

}) => {
  // Auth0
  const { user, error, isLoading } = useUser()
  // Hooks
  const { isFetchingAccount } = useAccount()
  // State to manage selected chart view
  const [selectedView, setSelectedView] = useState<'chartjs' | 'd3'>('chartjs')


  const handleOnChartViewChange = (e: any) => [
    setSelectedView(e.target.value as 'chartjs' | 'd3') 
  ]



  return (
    <>
      <NetworkRequestSuspense
        isLoading={ isLoading && !user && isFetchingAccount }
        spinnerOptions={{
          showSpinner: true,
        }}
      >
        <main 
          className={ `${appStyles.main}` }
          style={{ 
          }}
        >
          <div
            style={{
              ...definitelyCenteredStyle,
              flexDirection: 'column',
            }}
          >
            <div>
              <h1>
                { `Profile` }
              </h1>
              { user && (
                <>
                  <div style={ { marginBottom: '24px' } }>
                    <p>
                      { `Welcome, ${user.name}!` }
                    </p>
                  </div>
                </>
              )}
            </div>

            { user && (
              <>
                <div
                  className={ sectionStyles['profile-content'] }
                  style={ {
                    ...definitelyCenteredStyle,
                    flexDirection: 'column',
                  } }
                >
                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="chart-select">
                      { `Select Chart View: ` }
                    </label>
                    <select
                      id="chart-select"
                      value={ selectedView }
                      onChange={ handleOnChartViewChange }
                    >
                      <option value="chartjs">
                        { `Chart.js View` }
                      </option>
                      <option value="d3">
                        { `D3.js View` }
                      </option>
                    </select>
                  </div>
                  { selectedView === 'chartjs' && <ChartjsHistoricalAssessments /> }
                  { selectedView === 'd3' && <HistoricalAssessments /> }
                </div>
              </>
            )}

          </div>
        </main>
      </NetworkRequestSuspense>
    </>
  )
}


export default Profile