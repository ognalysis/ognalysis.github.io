<style>
#TireW, #SWP, #wheelsize {
	width: 50px;
}
</style>

<div>
<label name="TireS">Tire Size</label>
<input type="number" id="TireW"></input> <text>/</text>
<input type="number" id="SWP"></input><text>R</text>
<input type="number" id="wheelsize"></input> <text>e.g. 235/35R18</text>
<br><br>
<button onClick="Calculate()">Calculate</button>
<text id="results"></text>
<p>Hint: Sidewall is percentage of Tire width.</p>
<p>Example: 235/35R18 - 235mm is the width of the tire;</p>
<p>35 is percentage of tire width that is the sidewall width.</p>
<p>235mm * 0.35 = 82.25mm is the sidwall height.</p>

</div>
<script>
function Calculate() {
var TireW = document.getElementById("TireW").value;
var SWP = document.getElementById("SWP").value;
var wheelsize = document.getElementById("wheelsize").value;
var mm = 25.4

var sidewall = (TireW * (SWP / 100));
var results = (sidewall * 2) + (wheelsize * mm);
document.getElementById("results").innerHTML = results;
}
</script>
