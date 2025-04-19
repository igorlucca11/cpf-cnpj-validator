import { useEffect, useState } from "react";
import { isValidCpf } from "../utils/cpfValidator";
import { isValidCNPJ } from "../utils/cnpjValidator";

const Validator = () => {

    const [document, setDocument] = useState('');
    const [valid, setValid] = useState(false);
    const [message, setMessage] = useState('');
    const [inputColor, setInputColor] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        setDocument(formatDocument(rawValue));
    };

    useEffect(() => {
        handleValidation()
    }, [document])

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
        if (document.length === 0) {
            setValid(false)
            setInputColor('')
            setMessage('Favor preencher o campo')
            return
        }
        if (isValidCpf(document)) {
            setValid(true)
            setInputColor('is-valid')
            setMessage('Formato do CPF válido')
        } else if (isValidCNPJ(document)) {
            setValid(true)
            setInputColor('is-valid')
            setMessage('Formato do CNPJ válido')
        } else {
            setValid(false)
            setInputColor('is-invalid')
            setMessage('O número acima não corresponde a um CPF ou CNPJ válido')
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
                                                    <input type="text" className={`form-control ${inputColor}`} id="floatingInput" placeholder="Digite o CPF ou CNPJ"
                                                        value={document}
                                                        onChange={handleInputChange}
                                                    />
                                                    <label htmlFor="floatingInput">Digite o CPF ou CNPJ</label>
                                                <small className="text-muted ms-1">{message}</small>
                                                </div>
                                                <button disabled={!valid} type="button" className="btn btn-primary">Validar</button>
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