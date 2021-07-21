
import { ArrowDownCircle } from 'react-feather';
import BG_GRID from './assets/BG_GRID.png'
import CustomCursor from 'custom-cursor-react';
import 'custom-cursor-react/dist/index.css';

const App = () => {
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
          <ArrowDownCircle size={77} className="pointer" />
        </div>
        <div className="container flex-centered full-height full-width relative">
          <div className="bg-el-home"></div>
          <div className="headline">
            WEB<br />
            DEVELOPER<br />
            BASED IN<br />
            NEPAL
          </div>
        </div>
        <div className="nav flex column items-end justify-end"
          style={{ fontSize: '1.4rem', width: '20%' }}>
          <div className="nav-item secondary-text fw-600 pt-md pointer">HOME</div>
          <div className="nav-item secondary-text fw-600 pt-md pointer">ABOUT</div>
          <div className="nav-item secondary-text fw-600 pt-md pointer">WORK</div>
          <div className="nav-item secondary-text fw-600 pt-md pointer">CONTACT</div>
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
    </main>
  )
}

export default App;
