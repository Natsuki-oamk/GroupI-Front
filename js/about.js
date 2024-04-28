document.addEventListener("DOMContentLoaded", function() {
    var circles = document.querySelectorAll('.circle');
    circles.forEach(function(circle) {
      setTimeout(function() {
        circle.classList.add('hover-effect');
        setTimeout(function() {
          circle.classList.remove('hover-effect');
        }, 2000); 
      }, 1000); 
    });
  });
  