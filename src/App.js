
import { ArrowDownCircle } from 'react-feather';
import BG_GRID from './assets/BG_GRID.png'
import CustomCursor from 'custom-cursor-react';
import 'custom-cursor-react/dist/index.css';
import { useState } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <main>
      <section className="home flex relative">
        <div className="bg-grid flex-centered">
          <img src={BG_GRID} alt="BG_GRID" />
        </div>
        <div style={{ width: '20%' }} className="indicate-title secondary-text full-height flex column justify-between">
          <div className="text">
            <div className="fw-600">PORTFOLIO OF</div>
            <div className="fw-800">SUMEDH<br /> BAJRACHARYA</div>
          </div>
          {/* <ArrowDownCircle size={77} className="pointer" /> */}
        </div>
        <div className="container flex-centered full-height full-width relative">
          <div className="bg-el-home"></div>
          {
            activeTab === 1 ?
              <div className="headline">
                WEB<br />
                DEVELOPER<br />
                BASED IN<br />
                NEPAL
              </div>
              :
              activeTab === 2 ?
                <div className="headline">
                  I AM <br />
                  FROM<br />
                  BHAKTAPUR
                </div>
                :
                activeTab === 3 ?
                  <div className="headline">
                    I CURRENTLY <br />
                    WORK AT<br />
                    GRITFEAT SOLUTIONS
                  </div>
                  :
                  activeTab === 4 ?
                    <div className="headline socials">
                      I'M REACHABLE<br />
                      AT<br />
                      <span className="fb pointer">
                        <a href="https://www.facebook.com/sumeddhh/">FACEBOOK</a></span><br />
                      <span className="li pointer">
                        <a href="https://www.linkedin.com/in/sumedh-bajracharya-1193361b6">LINKEDIN</a></span><br />
                    </div> :
                    ''
          }
        </div>
        <div className="nav flex column items-end justify-end"
          style={{ fontSize: '1.4rem', width: '20%' }}>
          <div className={activeTab === 1 ? 'active nav-item secondary-text fw-600 pt-md pointer' : 'nav-item secondary-text fw-600 pt-md pointer'}
            onClick={() => {
              setActiveTab(1)
            }}>HOME</div>
          <div className={activeTab === 2 ? 'active nav-item secondary-text fw-600 pt-md pointer' : 'nav-item secondary-text fw-600 pt-md pointer'}
            onClick={() => {
              setActiveTab(2)
            }}>ABOUT</div>
          <div className={activeTab === 3 ? 'active nav-item secondary-text fw-600 pt-md pointer' : 'nav-item secondary-text fw-600 pt-md pointer'}
            onClick={() => {
              setActiveTab(3)
            }}>WORK</div>
          <div className={activeTab === 4 ? 'active nav-item secondary-text fw-600 pt-md pointer' : 'nav-item secondary-text fw-600 pt-md pointer'}
            onClick={() => {
              setActiveTab(4)
            }}>CONTACT</div>
        </div>
      </section>
      <CustomCursor
        customClass='custom-cursor'
        dimensions={30}
        fill='#FFF'
        smoothness={{
          movement: 0.2,
          scale: 0.1,
          opacity: 0.2,
        }}
        targetOpacity={0.5}
      />
    </main >
  )
}

export default App;
