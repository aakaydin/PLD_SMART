import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import Dropzone from 'react-dropzone'
import Slider, {Handle, SliderTooltip} from 'rc-slider';
import {toast} from "react-hot-toast";
import ProgressButton from "react-progress-button";

import ResultTile from "./ResultTile";
import FileTile from "./FileTile";

import 'react-image-picker/dist/index.css'
import '../button.css'
import '../slider.css';

export default class TogetherComp extends Component{
    constructor(props) {
        super(props)
        this.state = {
            file1: [],
            file2: [],
            buttonState: '',
            isLoading: false,
            hasResult:false,
            downloadLink: '',
            fileName: 'New Creation',
            length: 50,
            balance: 50
        }
        this.onDrop1 = this.onDrop1.bind(this);
        this.onDrop2 = this.onDrop2.bind(this);
        this.generateFile = this.generateFile.bind(this);
    }

    onDrop1(acceptedFiles){
        console.log(acceptedFiles);
        var filesTemp = this.state.file1;
        acceptedFiles.forEach(item => {
            if (filesTemp.length<1) {
                filesTemp.push(item);
            }
        });
        this.setState(state => {
            return {
                file1: filesTemp,
            };
        })
    }
    onDrop2(acceptedFiles){
        console.log(acceptedFiles);
        var filesTemp = this.state.file2;
        acceptedFiles.forEach(item => {
            if (filesTemp.length<1) {
                filesTemp.push(item);
            }
        });
        this.setState(state => {
            return {
                file2: filesTemp,
            };
        })
    }

    generateFile() {
        //get files
        this.state.files.forEach((file) => {
            const reader = new FileReader();
            reader.onabort = () => toast.error("file reading was aborted");
            reader.onerror = () => toast.error('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                //more on https://developer.mozilla.org/en-US/docs/Web/API/FileReader
                const binaryStr = reader.result
                console.log(binaryStr)
            }
            reader.readAsArrayBuffer(file)
        })
        //call code to generate file and get download link
        //wait until complete
        //when complete
        this.setState({
            isLoading: true,
            buttonState: 'loading',
        });

    }

    render() {
        const handle = props => {
            const { value, dragging, index, ...restProps } = props;
            return (
                <SliderTooltip
                    prefixCls="rc-slider-tooltip"
                    overlay={`${value}`}
                    visible={dragging}
                    placement="top"
                    key={index}
                >
                    <Handle value={value} {...restProps} />
                </SliderTooltip>
            );
        };

        const selectedStyle = {
            color: 'white',
            backgroundColor: 'black',
            border: 'solid white 1px',
            marginBottom: '20px',
        };
        const generateStyle = {
            padding: '20px',
        };
        return(
            <>
                <div className="scratch">
                    <Link to="/studio">back to studio</Link>
                    <h4>Bring Together</h4>
                    <p>Bring your favorite two musical pieces together. Upload two midi files and our
                        algorithm will interpolate and create two original mash-ups of your uploaded music. Choose
                        the length and the balance of your mashup for the perfect result.</p>
                    <div className="files">
                        <ResultTile isLoading={this.state.isLoading} downloadLink={this.state.downloadLink} fileName={"File 1 into File 2"} hasResult={this.state.hasResult}></ResultTile>
                    </div>
                    <h5>Upload your files in order</h5>
                    <div className="files">
                        {this.state.file1.length == 1 ?
                            <FileTile fileName={this.state.file1[0].name} downloadLink={""}></FileTile>
                            : <Dropzone onDrop={this.onDrop1} maxFiles={1}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div className="tile" {...getRootProps()}>
                                            <h4>Upload File</h4>
                                            <div className="zone">
                                                <input {...getInputProps()} />
                                                <p>Drag & drop up your file here, or click to select a file</p>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>}

                        {this.state.file2.length == 1 ?
                            <FileTile fileName={this.state.file2[0].name} downloadLink={""}></FileTile>
                            : <Dropzone onDrop={this.onDrop2} maxFiles={1}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div className="tile" {...getRootProps()}>
                                            <h4>Upload File</h4>
                                            <div className="zone">
                                                <input {...getInputProps()} />
                                                <p>Drag & drop up your file here, or click to select a file</p>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>}
                    </div>
                    <h5>Options</h5>
                    <div className="maxislider">
                        <h6>Length</h6>
                        <Slider min={0} max={500} defaultValue={50} handle={handle} step={10} onChange={value => {this.setState({length: value})}}/>
                    </div>
                    <div className="maxislider">
                        <h6>Balance of Mix</h6>
                        <Slider min={0} max={100} defaultValue={50} handle={handle} step={10} onChange={value => {this.setState({balance : value})}}/>
                    </div>
                    <h6><br/> </h6>
                    <ProgressButton onClick={this.generateFile} state={this.state.buttonState}>
                        Generate
                    </ProgressButton>
                    <h5> </h5>

                </div>
            </>
        )

    }
}