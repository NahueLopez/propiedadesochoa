import axios from "axios";

export const GetPropiedades = async() => {
    try {
        const response = await axios.get("");
        return response.data;
    }catch (error){
        console.log("Error al obtener los datos", error);
        throw error;
    }
}

