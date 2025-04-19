import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react"
const Footer = () => {
    return (
        <footer className="py-4 h-25 text-center text-sm text-gray-500 border-t border-gray-200 mt-auto mb-0">
            <div className="container row mx-auto d-flex aling-items-between justify-content-center ">
                <span className="col-12 text-center">Created by Igor Lucca © {new Date().getFullYear()}</span> 
                <a className="col-1 text-center" href="https://github.com/igorlucca11" target="_blank" rel="noopener noreferrer">
                <IconBrandGithub />GitHub</a>
                <a className="col-1 text-center" href="https://www.linkedin.com/in/igorlucca/" target="_blank" rel="noopener noreferrer">
                <IconBrandLinkedin />LinkedIn</a>
                
            </div>
        </footer>
    )
}
export default Footer