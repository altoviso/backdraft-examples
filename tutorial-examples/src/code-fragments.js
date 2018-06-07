class Person extends Component {
	// person interface goes here
}
// set the static className by defining a static property...
Person.staticClassName = "person";

let p = render(Person);
// the root dom node of p will have className==="person"

let vip = render(Person, {className:"important"});
// the root dom node of vip will have className==="person important"

vip.addClassname("loser");
// the root dom node of vip will have className==="person important loser"

vip.className("big loooooser");
// the root dom node of vip will have className==="big loooooser"
// notice everything other than the static className was is affected

// set the static className by providing a constructor argument..
let s = render(Person, {staticClassName: "student"});
// the root dom node of s will have className==="person student"

class Manager extends Person {
	get elements(){
		e("div", {className: "manager"})
	}
}

let m = render(Manager, {className:"accounting"});
// the root dom node of m will have className==="person manager accounting"

m.className("bad");
// the root dom node of m will have className==="person bad"
// we stepped on accounting...probably OK, likely an instance state
// but also stepped on manager...probably not an instance state
// manager should probably be a static className

// className can be mutated before rendering with effect
p = new Person();
p.addClass("new");
p.addClass("training");
p.render();
// the root dom node of p will have className==="person new training"

