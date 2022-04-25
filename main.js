function numeroAleatorio() {
  var aleatorios = [];
  for (let i = 0; i < 3; i++) {
    aleatorios[i] = Math.floor(Math.random() * 256);
  }
  return aleatorios;
}

let rgb = numeroAleatorio();
console.log(rgb);
let rgbString = rgb.toString();
console.log(rgbString);

const cuadroIzquierda = document.querySelector("section p");

cuadroIzquierda.innerHTML = "<p>RGB: " + numeroAleatorio() + "</p>";

const topBox = document.querySelector("#top");

console.log(topBox);

topBox.setAttribute("style", "background-color: rgb(rgbString)");
