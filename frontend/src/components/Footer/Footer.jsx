import 'react';
import logo from '../../assets/Clueless_Favicon.png';

const Footer = () => {
    return (
        <div className="w-full">
            <footer className="footer footer-horizontal w-full bg-base-200 text-base-content px-10 py-14 border-t border-[#7A5C46]">
                <aside>
                    <img
                        src={logo}
                        className="w-24 h-auto object-contain"
                        alt="Clueless Logo"
                    />

                    <p className="text-[#7A5C46]">
                        AITA Industries Ltd.
                        <br />
                        Providing reliable WebApps since 2026
                    </p>
                </aside>

                <nav>
                    <h6 className="footer-title text-[#7A5C46]">Services</h6>
                    <a className="link link-hover">Branding</a>
                    <a className="link link-hover">Design</a>
                    <a className="link link-hover">Marketing</a>
                    <a className="link link-hover">Advertisement</a>
                </nav>

                <nav>
                    <h6 className="footer-title text-[#7A5C46]">Company</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav>

                <nav>
                    <h6 className="footer-title text-[#7A5C46]">Legal</h6>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                </nav>
            </footer>

            <div className="w-full bg-base-200 pb-6 overflow-hidden">
                <p
                    className="text-[12vw] font-bold tracking-tight leading-none"
                    style={{
                        color: '#7A5C46',
                        fontFamily: "'Playfair Display', serif"
                    }}
                >
                    Clueless
                </p>
            </div>
        </div>
    );
};

export default Footer;