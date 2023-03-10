




const datos = {
    form:{
        nodos:{
        node1: document.getElementById("email"),
        nodePassword: document.getElementById("password"),
        nodeName: document.getElementById("nombreFull"),
        nodeEdad: document.getElementById("edad"),
        nodeDireccion: document.getElementById("direccion"),
        nodeDireccionBotonMap: document.getElementById("mostrar-mapa"),
        nodeParentMap: document.querySelector(".targeta-registro.map .contenedor-mapa"),
        },
        class:{
        valid: "correct",
        show: "show",
        }
    },
    map:{
        nodos:{
        nodeMap: document.querySelector("#map"),
        }
    }
}









const { createApp } = Vue;
createApp({
    data() {
        return {
            alumnos: [],
            alumno:{
                usuario:{
                    id: '',
                    email: '',
                    password: '',
                }
            },
        }
    },
    methods:{
        guardarAlumno(){
          if (validEmail(this.alumno.usuario.email) && validPassword(this.alumno.usuario.password)){
            this.alumno.usuario.id = "id" + generateUniqueID();
            this.alumnos = JSON.parse(localStorage.getItem("alumno") || "[]" );
            this.alumnos.push( this.alumno );
            localStorage.setItem("alumno", JSON.stringify(this.alumnos) );
            changePageHref("templates/root.html");
          }
          else if (validEmail(this.alumno.email)){
            console.log("*** Ingreso de usuario UGB: Contraseña invalida")
          }
          else if (validPassword(this.alumno.password)){
            console.log("*** Ingreso de usuario UGB: Email invalida")
          }
          else{
            console.log("*** Ingreso de usuario UGB: Email y Contraseña invalidas")
          }
          
        },
    }
}).mount('#app');








generateShortCutIcon("static/resource/img/logo/img1000.png");

validateEmail(document.querySelector("#email"));
  
validatePassword(datos.form.nodos.nodePassword);

validateName(datos.form.nodos.nodeName);

validateAge(datos.form.nodos.nodeEdad);

validateAddressNode(document.getElementById("direccion"));

leafletMap("map", document.getElementById("direccion"),13.341725,-88.418237,false);

showHideMap(document.querySelector("#mostrar-mapa"),document.querySelector(".targeta-registro.map .contenedor-mapa"),"show");

