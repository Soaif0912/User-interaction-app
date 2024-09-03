
import Loader from "react-js-loader";

const LoaderComp =(props)=>{

    const color = 'black';

    return(

        <Loader type={props.loaderType} bgColor={props.loaderColor} color={props.loaderColor} title={''} size={props.loaderSize} />
    )
}
export default LoaderComp;