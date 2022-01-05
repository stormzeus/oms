window.onload = function(){

    //there will be one span element for each input field
    // when the page is loaded, we create them and append them to corresponding input element 
	// they are initially empty and hidden
    //email check
    var span1 = document.createElement("span");
    span1.innerHTML = "The email field should be a valid email address (abc@def.xyz).";
	span1.style.display = "none"; //hide the span element
	var email = document.getElementById("email");
    email.parentNode.appendChild(span1);
    
    email.onfocus = function(){
        email.classList.remove("error");
        span1.style.display = "block";
    }

    email.onblur = function(){
        if (email.value == "")
        {
            span1.innerHTML = "The email field should be a valid email address (abc@def.xyz).";
            span1.style.display = "none";
        }
        span1.style.display = "none";
    }
    //password check
    var span2 = document.createElement("span");
    span2.innerHTML = "The password field should contain at least six characters.";
	span2.style.display = "none"; //hide the span element
	var pwd = document.getElementById("pwd");
    pwd.parentNode.appendChild(span2);
    
    pwd.onfocus = function(){
        pwd.classList.remove("error");
        span2.style.display = "block";
    }

    pwd.onblur = function(){
        if (email.value == "")
        {
            span2.innerHTML = "The password field should contain at least six characters.";
            span2.style.display = "none";
        }
        span2.style.display = "none";
    }
    //password confirm check
    var span3 = document.createElement("span");
    span3.innerHTML = "Password and confirm password fields should match.";
	span3.style.display = "none"; //hide the span element
	var confirm = document.getElementById("confirm");
    confirm.parentNode.appendChild(span3);
    
    confirm.onfocus = function(){
        confirm.classList.remove ("error");
        span3.style.display = "block";
    }

    confirm.onblur = function(){
        if (confirm.value == "")
        {
            span3.innerHTML = "Password and confirm password fields should match.";
            span3.style.display = "none";
        }
        span3.style.display = "none";
    }


    document.getElementById("myForm").onsubmit = function() {
        var emailreg = /\S+@\S+\.\S+$/;
        if(!emailreg.test(email.value))
        {
            email.classList.add("error");
            span1.innerHTML = "Error! not a valid email.";
            return false;
        }
        if(pwd.value.length < 6)
        {
            pwd.classList.add("error");
            span2.innerHTML = "Error! not a valid password.";
            return false;
        }
        if(confirm.value.localeCompare(pwd.value))
        {
            confirm.classList.add("error");
            pwd.classList.add("error");
            span3.innerHTML = "Error! passwords do not match.";
            return false;
        }
    }
}
