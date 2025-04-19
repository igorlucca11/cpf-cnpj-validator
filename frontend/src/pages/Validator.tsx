import { useState } from "react";

const Validator = () => {

const [document, setDocument] = useState('');

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setDocument(formatDocument(rawValue));
    console.log(document);
    console.log(rawValue);
  };

  const formatDocument = (value: string): string => {
    if (value.length <= 11) {
      return value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };
const handleValidation = () => {
    if (document.length === 11) {
        alert('CPF');
    } else if (document.length === 14) {
        alert('CNPJ');
    }
}

    return (<div className="page-wrapper">
        <div className="page-body">
            <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Validador de CPF/CNPJ</h2>
                            </div>
                            <div className="card-body">
                                <div className="row row-cards">
                                    <div className="col-12 col-lg-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" id="floatingInput" placeholder="Digite o CPF ou CNPJ" 
                                                    value={document}
                                                    onChange={handleInputChange}
                                                    />
                                                    <label htmlFor="floatingInput">Digite o CPF ou CNPJ</label>
                                                </div>
                                                <button type="button" className="btn btn-primary">Validar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default Validator;