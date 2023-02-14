









// Printers * * * * * * * * * *

//----------IMPRIMIR VALORES DEL LOCAL STORAGE A TEMPLATE HTML

function printFromLocalStorageToDOM(prKeyLS, template, placeToPrint) {
  let listado = localStorage.getItem(prKeyLS);
  if (listado) {
    listado = JSON.parse(listado);
    let listaHTML = "";
    for (let i = 0; i < listado.length; i++) {
      let item = listado[i];
      let currentItem = item;
      let itemData = {};

      const regex = /{([\w.]+)}/g;
      let match;
      while ((match = regex.exec(template)) !== null) {
        const fullKey = match[1];
        const value = getValueByKeys(currentItem, fullKey);
        itemData[`{${fullKey}}`] = value;
      }

      let itemHTML = template;
      for (let key in itemData) {
        itemHTML = itemHTML.replaceAll(key, itemData[key]);
      }
      listaHTML += itemHTML;
    }
    document.querySelector(placeToPrint).innerHTML = listaHTML;
  } else {
    console.log("No hay datos en el local storage");
  }
}










// Finders * * * * * * * * * *

//----------ENCONTRAR ELEMENTO PADRE POR CLASE, ID O TAGNAME

function findParentNode(element, targetParentClass) {
  let current = element;
  while (current) {
    if ((current.classList && current.classList.contains(targetParentClass)) ||
        (current.id && current.id === targetParentClass) ||
        (current.tagName && current.tagName === targetParentClass.toUpperCase())) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
};

//----------ENCONTRAR ELEMENTO HIJO POR CLASE, ID O TAGNAME

function findChildNode(element, searchValue) {
  if (!element || !element.children) {
    return null;
  }

  let children = element.children;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    if ((child.classList && child.classList.contains(searchValue)) ||
        (child.id && child.id === searchValue) ||
        (child.tagName && child.tagName === searchValue.toUpperCase())) {
      return child;
    }

    let found = findChildNode(child, searchValue);
    if (found) {
      return found;
    }
  }

  return null;
}

function findChildNodes(element, searchValue) {
  if (!element || !element.children) {
    return [];
  }

  let children = element.children;
  let matchingNodes = [];
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    if ((child.classList && child.classList.contains(searchValue)) ||
        (child.id && child.id === searchValue) ||
        (child.tagName && child.tagName === searchValue.toUpperCase())) {
      matchingNodes.push(child);
    }
  }

  return matchingNodes;
}

//----------ENCONTRAR ELEMENTO HIJO DE ARRAY POR RUTA

function findKeyChildNode(data, searchKeyArray) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let searchKeys = searchKeyArray.split("/");
      let currentItem = item;
      let found = true;
      for (let j = 0; j < searchKeys.length; j++) {
          if (!currentItem[searchKeys[j]]) {
              found = false;
              break;
          }
          currentItem = currentItem[searchKeys[j]];
      }

      if (found) {
          result.push(currentItem);
      }
  }
  if (result.length == 0) {
      result.push("Datos no encontrados");
  }
  return result;
}










// Getters * * * * * * * * * *

//----------OBTENER LOS VALORES DE ARRAY POR SUS KEYS

function getValueByKeys(obj, keysString) {
  const keys = keysString.split('.');
  let value = obj;
  for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (value.hasOwnProperty(key)) {
      value = value[key];
      } else {
      return undefined;
      }
  }
  return value;
}








// Deleters * * * * * * * * * *

//----------DELETE NODO PADRE MEDIANTE HIJO

function deleteParentViaChild(child,findParentIdentifier){
  let containerMainData = findParentNode(child, findParentIdentifier);
  containerMainData.remove();
}

//----------DELETE DATA DE LOCAL STORAGE + ALGUNA ESTRUCTURA HTML PADRE

function deleteLocalStorageDOMData(botonDelete,findParentIdentifier,queryNodeToCompareText,prKeyLS,keyPathToCompare) {
  let target = botonDelete.target;
  let emailElement = findParentNode(target, findParentIdentifier).querySelector(queryNodeToCompareText);
  let email = emailElement.textContent;

  let localStorageData = JSON.parse(localStorage.getItem(prKeyLS));
  for (let i = 0; i < localStorageData.length; i++) {
      let item = localStorageData[i];
      let searchKeys = keyPathToCompare.split("/");
      let currentItem = item;
      let found = true;
      for (let j = 0; j < searchKeys.length; j++) {
          if (!currentItem[searchKeys[j]]) {
              found = false;
              break;
          }
          currentItem = currentItem[searchKeys[j]];
      }
      if (found) {
          console.log("se encontro");
          if (currentItem === email) {
              localStorageData.splice(i, 1);
              console.log("se borro");
              break;
          }
      }
  }

  localStorage.setItem(prKeyLS, JSON.stringify(localStorageData));
  deleteParentViaChild(target,findParentIdentifier)
  
}

//----------DELETE DATA DE LOCAL STORAGE

function deleteLocalStorageViaCompare(textToCompare,prKeyLS,keyPathToCompare) {
  let textCompare = textToCompare;
  let localStorageData = JSON.parse(localStorage.getItem(prKeyLS));
  for (let i = 0; i < localStorageData.length; i++) {
      let item = localStorageData[i];
      let searchKeys = keyPathToCompare.split("/");
      let currentItem = item;
      let found = true;
      for (let j = 0; j < searchKeys.length; j++) {
          if (!currentItem[searchKeys[j]]) {
              found = false;
              break;
          }
          currentItem = currentItem[searchKeys[j]];
      }
      if (found) {
          if (currentItem === textCompare) {
              localStorageData.splice(i, 1);
              console.log("se borro");
              break;
          }
      }
  }
  localStorage.setItem(prKeyLS, JSON.stringify(localStorageData));
}










// Validates * * * * * * * * * *

//----------VALIDA EMAILS

function validEmail(email) {
    //usage: validateEmail(emailNode);
    //active: Se activa de inmediato una vez se a llamado y preveido del String email.
    //requiere: 
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validEmailOnInput(email, callback) {
    //usage: validateEmailOnInput(emailNode, function(result){ console.log(result);});
    //active: Se activa cada vez que en el Nodo input cambia su value (Cuando escribe).
    //requiere: 
    const emailInput = email;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    emailInput.addEventListener("input", function() {
        const isValidEmail = emailRegex.test(emailInput.value);
        callback(isValidEmail);
    });
}

function validateEmail(email){
    if (validEmail(email.value)){
        email.classList.add("correct");
        validEmailOnInput(email, function(result){
            const email = email;
            if (result) {
                email.classList.add("correct");
            }
            else {
                email.classList.remove("correct");
            }
        });
    }
    else {
        validEmailOnInput(email, function(result){
            const emails = email;
            if (result) {
                emails.classList.add("correct");
            }
            else {
                emails.classList.remove("correct");
            }
        });
    }
}

//----------VALIDA CONTRASEñAS

function validPassword(password) {
    //usage: validatePassword(passwordNode);
    //active: Se activa de inmediato una vez se a llamado y preveido del String password.
    //valid: valida que la contraseña tenga al menos 8 caracteres, con al menos una letra y un número
    let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(String(password));
}

function validPasswordOnInput(password, callback) {
    //usage: validatePasswordOnInput(passwordNode, function(result){ console.log(result);});
    //active: Se activa cada vez que en el Nodo input cambia su value (Cuando escribe).
    //valid: valida que la contraseña tenga al menos 8 caracteres, con al menos una letra y un número
    const passwordInput = password;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
    passwordInput.addEventListener("input", function() {
      const isValidPassword = passwordRegex.test(passwordInput.value);
      callback(isValidPassword);
    });
}

function validatePassword(password) {
    if (validPassword(password.value)) {
      password.classList.add("correct");
      validPasswordOnInput(document.getElementById("password"), function(result) {
        const password = document.getElementById("password");
        if (result) {
          password.classList.add("correct");
        } else {
          password.classList.remove("correct");
        }
      });
    } else {
      validPasswordOnInput(document.getElementById("password"), function(result) {
        const password = document.getElementById("password");
        if (result) {
          password.classList.add("correct");
        } else {
          password.classList.remove("correct");
        }
      });
    }
}

//----------VALIDA NOMBRES

function validName(name) {
  //usage: validateName(nameNode);
  //active: Se activa de inmediato una vez se a llamado y proveido del String 
let re = /^[a-zA-Z\u00C0-\u017F]+((\s[a-zA-Z\u00C0-\u017F]+)(\s(de\s[a-zA-Z\u00C0-\u017F]+))?)+$/;

  return re.test(String(name));
}

function validNameOnInput(name, callback) {
  //usage: validateNameOnInput(nameNode, function(result){ console.log(result);});                                                             
  //active: Se activa cada vez que en el Nodo input cambia su value (Cuando escribe).
  const nameInput = name;
  const nameRegex = /^[a-zA-Z\u00C0-\u017F]+((\s[a-zA-Z\u00C0-\u017F]+)(\s(de\s[a-zA-Z\u00C0-\u017F]+))?)+$/;

  nameInput.addEventListener("input", function() {
    const isValidName = nameRegex.test(nameInput.value);
    callback(isValidName);
  });
}

function validateName(nameFull) {
  if (validName(nameFull.value)) {
    nameFull.classList.add("correct");
    validNameOnInput(nameFull, function(result) {
      const name = nameFull;
      if (result) {
        name.classList.add("correct");
      } else {
        name.classList.remove("correct");
      }
    });
  } else {
    validNameOnInput(nameFull, function(result) {
      const name = nameFull;
      if (result) {
        name.classList.add("correct");
      } else {
        name.classList.remove("correct");
      }
    });
  }
}

//----------VALIDA EDADES

function validAge(age) {
  //usage: validateAge(ageNode);
  //active: Se activa de inmediato una vez se ha llamado y se ha previsto el valor de edad.
  //requiere: Un valor numérico para la edad.
  return !isNaN(age) && age >= 16;
}

function validAgeOnInput(age, callback) {
  //usage: validateAgeOnInput(ageNode, function(result){ console.log(result);});
  //active: Se activa cada vez que en el Nodo input cambia su valor (cuando se escribe).
  //requiere: Un valor numérico para la edad.
  const ageInput = age;

  ageInput.addEventListener("input", function() {
      const isValidAge = validAge(parseInt(ageInput.value));
      callback(isValidAge);
  });
}

function validateAge(age){
  if (validAge(parseInt(age.value))){
      age.classList.add("correct");
      validAgeOnInput(age, function(result){
          const ages = age;
          if (result) {
              ages.classList.add("correct");
          }
          else {
              ages.classList.remove("correct");
          }
      });
  }
  else {
      validAgeOnInput(age, function(result){
          const ages = age;
          if (result) {
              ages.classList.add("correct");
          }
          else {
              ages.classList.remove("correct");
          }
      });
  }
}

//----------VALIDA DIRECCIONES

function validateAddress(address) {
  //usage: validateAddress(addressNode);
  //active: Se activa de inmediato una vez se ha llamado y se ha proporcionado el nodo de dirección.
  //requiere: Dirección de vivienda que incluya al menos un número, una calle, una ciudad y un estado o un código postal.
  let re = /^\d+\s[A-z\u00C0-\u00FF]+\s[A-z\u00C0-\u00FF]+\s([A-z\u00C0-\u00FF]+\s|\d{5})/;
  return re.test(String(address).toLowerCase());
}

function validateAddressOnInput(address, callback) {
  //usage: validateAddressOnInput(addressNode, function(result){ console.log(result);});
  //active: Se activa cada vez que el nodo de dirección cambia su valor (cuando se escribe).
  //requiere: Dirección de vivienda que incluya al menos un número, una calle, una ciudad y un estado o un código postal.
  const addressInput = address;
  const addressRegex = /^\d+\s[A-z\u00C0-\u00FF]+\s[A-z\u00C0-\u00FF]+\s([A-z\u00C0-\u00FF]+\s|\d{5})/;

  addressInput.addEventListener("input", function() {
    const isValidAddress = addressRegex.test(addressInput.value);
    callback(isValidAddress);
  });
}

function validateAddressNode(address) {
  if (validateAddress(address.value)) {
    address.classList.add("correct");
    validateAddressOnInput(address, function(result) {
      const addresss = address;
      if (result) {
        addresss.classList.add("correct");
      } else {
        addresss.classList.remove("correct");
      }
    });
  } else {
    validateAddressOnInput(address, function(result) {
      const addresss = address;
      if (result) {
        addresss.classList.add("correct");
      } else {
        addresss.classList.remove("correct");
      }
    });
  }
}











// Existinguers * * * * * * * * * *

//----------ENCONTRAMOS LA EXISTENCIA DE DATA ESPECIFICA DE LOCAL STORAGE

function existLocalStorageData(textToCompare,prKeyLS,keyPathToCompare) {
  let textCompare = textToCompare;
  let localStorageData = JSON.parse(localStorage.getItem(prKeyLS));
  for (let i = 0; i < localStorageData.length; i++) {
      let item = localStorageData[i];
      let searchKeys = keyPathToCompare.split("/");
      let currentItem = item;
      let found = true;
      for (let j = 0; j < searchKeys.length; j++) {
          if (!currentItem[searchKeys[j]]) {
            return false;
          }
          currentItem = currentItem[searchKeys[j]];
      }
      if (found) {
          if (currentItem === textCompare) {
            return true;
          }
      }
  }
  return false;
}









// Mapa * * * * * * * * * *

function leafletMap(idMap, nodeToResult, initLat, initLong, usePopup) {
  var map = L.map(idMap).setView([initLat, initLong], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setView(pos,20);
    }, function() {
      // handleError
    });
  } else {
    // Browser doesn't support Geolocation
    handleError();
  }

  map.on('click', function(e) {
    if (usePopup) {
      var popup = L.popup();
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }

    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        let v = nodeToResult;
        let errorFind = "N/A";
        v.value = [
          data.address.road,
          data.address.house_number,
          data.address.building,
          data.address.park,
          data.address.neighbourhood,
          data.address.town,
          data.address.island,
          data.address.city,
          data.address.state,
          data.address.country
        ].filter(function(addressElement) {
          return addressElement !== undefined;
        }).join(" • ")

      });
  });
}

function showHideMap (boton,mapParent,addClass){
  boton.addEventListener("click", function() {
    if (mapParent.classList.contains(addClass)){
      mapParent.classList.remove(addClass);
    }
    else{
      mapParent.classList.add(addClass);
    }
  })
}










// Generators * * * * * * * * * *

//----------GENERADOR DE ID UNICO

function generateUniqueID() {
  return new Date().getTime().toString(20);
}

//----------GENERADOR DE TIEMPO

function generateCurrentTime() {
  return new Date().toLocaleTimeString();
}

//----------GENERADOR DE ICONO SHORTCUT

function generateShortCutIcon(linkImg){
  var link_icon_web = document.querySelector("link[rel='shortcut icon']") || document.createElement('link');
  link_icon_web.type = 'image/x-icon';
  link_icon_web.rel = 'shortcut icon';
  link_icon_web.href = linkImg;
  document.getElementsByTagName('head')[0].appendChild(link_icon_web);
}











// Addresses href * * * * * * * * * *

//----------CAMBIO POR DIRECCION HREF

function changePageHref(link){
  let linkNode = document.createElement("a");
  linkNode.setAttribute("href",link);
  linkNode.click();
}










// Actions on input * * * * * * * * * *

//----------ACCIONES AL ESCRIBIR

function actionOnInput(input, callback) {
  let inputElem = document.querySelector(input);
  inputElem.addEventListener("input", function() {
      callback();
  });
}





