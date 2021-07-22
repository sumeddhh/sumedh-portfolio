
// import { ArrowDownCircle } from 'react-feather';
import BG_GRID from './assets/BG_GRID.png'
import CustomCursor from 'custom-cursor-react';
import 'custom-cursor-react/dist/index.css';
import { useEffect, useState } from 'react';
import Background from './components/Background';
import Container from './components/Container';


const App = () => {
  let [activeTab, setActiveTab] = useState(1);

  window.onkeydown = logKey;

  function logKey(e) {
    switch (e.key) {
      case 'ArrowDown':
        if (activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4) {
          setActiveTab((activeTab + 1))
        }
        break;
      case 'ArrowUp':
        if (activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5) {
          setActiveTab((activeTab - 1))
        }
        break;
      default:
        console.log('default');
    }
  }



  return (
    <main
      style={{ background: '#0c0c0c' }}
      className={activeTab === 1 ? 'nm8-1' : activeTab === 2 ? 'nm8-2' : activeTab === 3 ? 'nm8-3' : activeTab === 4 ? 'nm8-4' : activeTab === 5 ? 'nm8-5' : ''}>
      <Background />
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
        <Container props={activeTab} />
        <div className="nav flex column items-end justify-end"
          style={{ fontSize: '1.4rem', width: '20%' }}>
          <div className={activeTab === 1 ? 'active nm8-link nav-item secondary-text fw-600 py-md' : 'nav-item secondary-text fw-600 py-md'}
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
            }}>PROJECTS</div>
          <div className={activeTab === 4 ? 'active nav-item secondary-text fw-600 py-md' : 'nav-item secondary-text fw-600 py-md'}
            onClick={() => {
              setActiveTab(4)
            }}>WORK</div>
          <div className={activeTab === 5 ? 'active nav-item secondary-text fw-600 py-md' : 'nav-item secondary-text fw-600 py-md'}
            onClick={() => {
              setActiveTab(5)
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
        targetOpacity={0.8}
        targets={['.nav-item', '.np', '.gf', '.li', '.fb', '.bkt']}
        targetScale={1.6}
      />
    </main >
  )
}

export default App;
