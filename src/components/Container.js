import { useEffect } from 'react';
import SUMEDH from '../assets/SUMEDH.png'

const Container = (activeTab) => {
    useEffect(() => {
        console.log('tab switch');
    }, [activeTab])
    return (
        <div className="container flex-centered full-height full-width relative transitionDiv">
            {/* <div className="bg-el-home"></div> */}
            {
                activeTab.props === 1 ?
                    <div className="flex column items-center">
                        <div
                            className="headline" style={{ textAlign: 'center' }}>
                            WEB<br />
                            DEVELOPER<br />
                            BASED IN<br />
                            <span className="np">
                                <a target="_blank" rel="noreferrer" href="https://www.welcomenepal.com/">NEPAL</a></span>
                        </div>
                        <div className="instruction"><span className="text">Use Up and Down Arrow Keys to Navigate</span></div>
                    </div>
                    :
                    activeTab.props === 2 ?
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
                            <div className="flex-centered" style={{ height: 'fitContent' }}>
                                <img className="my-img ml-xl"
                                    style={{ zIndex: '0' }}
                                    src={SUMEDH} alt="SUMEDH" width="350px" height="350px" />
                            </div>
                        </div>
                        :
                        activeTab.props === 3 ?
                            <div className="flex column items-end">
                                <div
                                    className="headline">
                                    I CURRENTLY <br />
                                    WORK AT<br />
                                    <span className="gf">
                                        <a target="_blank" rel="noreferrer" href="https://www.gritfeat.com/">GRITFEAT SOLUTIONS</a></span>
                                </div>
                                <div className="secondary-text text-right" style={{ width: '420px' }}>
                                    <p> I began my software development career with an internship program at ITGlance Pvt. Ltd.
                                        After 6 months of internship, I joined GritFeat Solutions in winter 2020.</p>
                                </div>
                            </div>
                            :
                            activeTab.props === 4 ?
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
    )
}

export default Container;