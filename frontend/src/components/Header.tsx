import avatar from '@assets/avatars/igor-lucca.jpeg'
import { IconSquareCheck } from "@tabler/icons-react";

const Header = () => {
    return (
        <header className="navbar navbar-expand-sm navbar-light d-print-none">
        <div className="container-xl">
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href="#">
              <IconSquareCheck size={24} color="green" />
            </a>
            Validador de CPF/CNPJ
          </h1>
          <div className="navbar-nav flex-row order-md-last">
            <div className="nav-item">
              <a href="#" className="nav-link d-flex lh-1 text-reset p-0">
                <span
                  className="avatar avatar-sm"
                >
                  <img src={avatar} />
                </span>
                <div className="d-none d-xl-block ps-2">
                  <div>Igor Lucca</div>
                  <div className="mt-1 small text-secondary">Developer</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>
    )
}

export default Header