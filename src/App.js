
// import { ArrowDownCircle } from 'react-feather';
import BG_GRID from './assets/BG_GRID.png'
import CustomCursor from 'custom-cursor-react';
import 'custom-cursor-react/dist/index.css';
import { useState } from 'react';
import SUMEDH from './assets/SUMEDH.png'

const App = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <main
      className={activeTab === 1 ? 'nm8-1' : activeTab === 2 ? 'nm8-2' : activeTab === 3 ? 'nm8-3' : activeTab === 4 ? 'nm8-4' : ''}>
      <section className="home flex relative">
        <div className="bg-grid flex-centered">
          <img src={BG_GRID} alt="BG_GRID" />
        </div>
        <div style={{ width: '20%' }} className="indicate-title secondary-text full-height flex column justify-between">
          <div className="text">
            <div className="fw-600">PORTFOLIO OF</div>
            <div className="fw-800">SUMEDH<br /> <span className="fw-900">BAJRACHARYA</span></div>
          </div>
          {/* <ArrowDownCircle size={77} className="pointer" /> */}
        </div>
        <div className="container flex-centered full-height full-width relative transitionDiv">
          {/* <div className="bg-el-home"></div> */}
          {
            activeTab === 1 ?
              <div
                className="headline">
                WEB<br />
                DEVELOPER<br />
                BASED IN<br />
                <span className="np">
                  <a target="_blank" rel="noreferrer" href="https://www.welcomenepal.com/">NEPAL</a></span>
              </div>
              :
              activeTab === 2 ?
                <div className="about flex">
                  <div className="flex column items-end">
                    <div
                      className="headline">
                      I AM <br />
                      FROM<br />
                      <span className="bkt">
                        <a target="_blank" rel="noreferrer" href="https://www.google.com/maps/place/Bhaktapur/data=!4m2!3m1!1s0x39eb1aae42806ba1:0x5449e079404e5e82?sa=X&ved=2ahUKEwjyxayZjPTxAhXf3jgGHZFnBYoQ8gEwAHoECAYQAQ">BHAKTAPUR
                        </a></span>
                    </div>
                    <div className="secondary-text text-right" style={{ width: '420px' }}>
                      <p> I graduated in BIM (Bachelors in Information Management) in 2021, under Tribhuvan University.
                        I enjoy gaming, watching movies & shows and web development.</p>
                    </div>
                  </div>
                  <img className="ml-xl"
                    style={{ zIndex: '0' }}
                    src={SUMEDH} alt="SUMEDH" width="350px" height="350px" />
                </div>
                :
                activeTab === 3 ?
                  <div className="flex column items-end">
                    <div
                      className="headline">
                      I CURRENTLY <br />
                      WORK AT<br />
                      <span className="gf">
                        <a target="_blank" rel="noreferrer" href="https://www.gritfeat.com/">GRITFEAT SOLUTIONS</a></span>
                    </div>
                    <div className="secondary-text text-right" style={{ width: '420px' }}>
                      <p> I began my IT career with an internship program at ITGlance Pvt. Ltd.
                        After 6 months of internship, I joined GritFeat Solutions in winter 2020.</p>
                    </div>
                  </div>
                  :
                  activeTab === 4 ?
                    <div
                      className="headline socials">
                      I'M <br />
                      REACHABLE ON<br />
                      <span className="fb">
                        <a target="_blank" rel="noreferrer" href="https://www.facebook.com/sumeddhh/">FACEBOOK</a></span> &<br />
                      <span className="li">
                        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/sumedh-bajracharya-1193361b6">LINKEDIN</a></span><br />
                    </div> :
                    ''
          }
        </div>
        <div className="nav flex column items-end justify-end"
          style={{ fontSize: '1.4rem', width: '20%' }}>
          <div className={activeTab === 1 ? 'active nav-item secondary-text fw-600 py-md' : 'nav-item secondary-text fw-600 py-md'}
            onClick={() => {
              setActiveTab(1)
            }}>HOME</div>
          <div className={activeTab === 2 ? 'active nav-item secondary-text fw-600 py-md' : 'nav-item secondary-text fw-600 py-md'}
            onClick={() => {
              setActiveTab(2)
            }}>ABOUT</div>
          <div className={activeTab === 3 ? 'active nav-item secondary-text fw-600 py-md' : 'nav-item secondary-text fw-600 py-md'}
            onClick={() => {
              setActiveTab(3)
            }}>WORK</div>
          <div className={activeTab === 4 ? 'active nav-item secondary-text fw-600 py-md' : 'nav-item secondary-text fw-600 py-md'}
            onClick={() => {
              setActiveTab(4)
            }}>CONTACT</div>
        </div>
      </section>
      <CustomCursor
        customClass='custom-cursor'
        dimensions={50}
        fill='#FFF'
        smoothness={{
          movement: 1,
          scale: 0.1,
          opacity: 0.2,
        }}
        targetOpacity={1}
        targets={['.nav-item', '.gf', '.li', '.fb', '.bkt']}
        targetScale={1}
      />
    </main >
  )
}

export default App;
