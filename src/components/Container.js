import { useEffect, useState } from 'react';
import SUMEDH from '../assets/SUMEDH.png'
import TextTransition, { presets } from "react-text-transition";
import { Timeline, TimelineEvent } from 'react-event-timeline'

const TEXTS = [
    "Designer",
    "Developer",
];

const Container = (activeTab) => {
    const [index, setIndex] = useState(0);
    const [displayContent, setDisplayContent] = useState(false);
    useEffect(() => {
        const intervalId = setInterval(() =>
            setIndex(index => index + 1),
            1500
        );
        return () => clearTimeout(intervalId);
    }, []);
    useEffect(() => {
        setDisplayContent(false)
        setTimeout(function () { setDisplayContent(true); }, 500);
    }, [activeTab])
    return (
        <div className="container flex-centered full-height full-width relative transitionDiv">

            {/* <div className="bg-el-home"></div> */}
            {
                activeTab.props === 1 && displayContent ?
                    <div className="flex column items-center nm8-contents">
                        <div
                            className="headline" style={{ textAlign: 'center' }}>
                            <TextTransition
                                text={TEXTS[index % TEXTS.length]}
                                springConfig={presets.gentle}
                                direction="down"
                            />
                            BASED IN<br />
                            <span className="np">
                                <a target="_blank" rel="noreferrer" href="https://www.welcomenepal.com/">NEPAL</a></span>
                        </div>
                        <div className="instruction mt-xl"><span className="text">Use Up and Down Arrow Keys to Navigate</span></div>
                    </div>
                    :
                    activeTab.props === 2 && displayContent ?
                        <div className="about flex nm8-contents">
                            <div className="flex column items-end">
                                <div
                                    className="headline">
                                    I AM <br />
                                    FROM<br />
                                    <span className="bkt">
                                        <a target="_blank" rel="noreferrer" href="https://www.google.com/maps/place/Bhaktapur/data=!4m2!3m1!1s0x39eb1aae42806ba1:0x5449e079404e5e82?sa=X&ved=2ahUKEwjyxayZjPTxAhXf3jgGHZFnBYoQ8gEwAHoECAYQAQ">BHAKTAPUR
                                        </a></span>
                                </div>
                                <div className="secondary-text text-right" style={{ width: '390px' }}>
                                    <p> I graduated in BIM (Bachelors in Information Management) in 2021, under Tribhuvan University.
                                        I enjoy gaming, watching movies & shows and web development.</p>
                                </div>
                            </div>
                            <div className="flex-centered">
                                <img className="my-img ml-xl"
                                    style={{ zIndex: '0' }}
                                    src={SUMEDH} alt="SUMEDH" width="350px" height="350px" />
                            </div>
                        </div>
                        :
                        activeTab.props === 3 && displayContent ?
                            <div className="adjust-height flex column items-end nm8-contents">
                                <div
                                    className="headline">
                                    PROJECTS <br />
                                    I HAVE<br />
                                    <span className="prj">WORKED ON</span>
                                </div>
                                <div className="gallery secondary-text text-right" style={{
                                    width: '600px',
                                    overflow: 'scroll'
                                }}>
                                    <ul style={{ fontSize: '22px' }}>
                                        <li>Inventory Management System</li>
                                        <li>Driving License Trial Booking App</li>
                                        <li>Music Streaming App</li>
                                        <li>School Management System</li>
                                        <li>Home Bakery Website</li>
                                        <li>Portfolio Website</li>
                                        <li>Online Examination Portal</li>
                                        <li>StartUp Management App</li>
                                        <li>& more websites...</li>
                                    </ul>
                                </div>
                            </div>
                            :
                            activeTab.props === 4 && displayContent ?
                                <div className="adjust-height flex column items-end justify-center nm8-contents" style={{ overflow: 'scroll' }}>
                                    <div
                                        style={{ height: '260px' }}
                                        className="headline full-height">
                                        MY WORK<br />
                                        <div className="gf">
                                            EXPERIENCE</div>
                                    </div>
                                    <div className="timeline secondary-text text-right full-height" style={{ width: '500px', overflowY: 'scroll' }}>
                                        <Timeline
                                            style={{ height: '100%' }}
                                            lineColor="#333">
                                            <TimelineEvent title="A Fresh Beginning"
                                                createdAt="June 2020"
                                                container="card"
                                                icon="•"
                                                style={{
                                                    color: '#444',
                                                    fontFamily: 'Montserrat',
                                                    fontSize: '1.1em',
                                                    marginBottom: '10px',
                                                    filter: 'grayscale(1) invert(1)',
                                                    boxShadow: 'none'
                                                }}
                                                cardHeaderStyle={{
                                                    backgroundColor: '#ccc',
                                                    color: '#444',
                                                    fontSize: '18px'
                                                }}
                                                bubbleStyle={{
                                                    backgroundColor: '#0c0c0c',
                                                    borderColor: '#444'
                                                }}
                                            >
                                                I started off as an Intern in ITGlance Pvt. Ltd.
                                            </TimelineEvent>
                                            <TimelineEvent
                                                title="Start of a Journey"
                                                createdAt="December 2020"
                                                container="card"
                                                icon="•"
                                                style={{
                                                    color: '#444',
                                                    fontFamily: 'Montserrat',
                                                    fontSize: '1.1em',
                                                    marginBottom: '10px',
                                                    filter: 'grayscale(1) invert(1)',
                                                    boxShadow: 'none'
                                                }}
                                                cardHeaderStyle={{
                                                    backgroundColor: '#ccc',
                                                    color: '#444',
                                                    fontSize: '18px'
                                                }}
                                                bubbleStyle={{
                                                    backgroundColor: '#0c0c0c',
                                                    borderColor: '#444'
                                                }}
                                            >
                                                I completed my internship and immediately joined GritFeat Solutions as a full-time UX Engineer.
                                            </TimelineEvent>
                                            <TimelineEvent
                                                title="The Climb"
                                                createdAt="2021"
                                                container="card"
                                                icon="•"
                                                style={{
                                                    color: '#444',
                                                    fontFamily: 'Montserrat',
                                                    fontSize: '1.1em',
                                                    marginBottom: '10px',
                                                    filter: 'grayscale(1) invert(1)',
                                                    boxShadow: 'none'
                                                }}
                                                cardHeaderStyle={{
                                                    backgroundColor: '#ccc',
                                                    color: '#444',
                                                    fontSize: '18px'
                                                }}
                                                bubbleStyle={{
                                                    backgroundColor: '#0c0c0c',
                                                    borderColor: '#444'
                                                }}
                                            >
                                                I currently work as the UI/UX and FrontEnd Engineer for GritFeat, while learning BackEnd Engineering as well.
                                            </TimelineEvent>
                                        </Timeline>
                                    </div>
                                </div>
                                :
                                activeTab.props === 5 && displayContent ?
                                    <div
                                        className="headline socials nm8-contents">
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