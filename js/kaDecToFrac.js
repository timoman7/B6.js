function floatToFraction(x, errors){
    let error=errors||0.000001;
    let n = Math.floor(x);
    x -= n;
    if(x < error){
        return {
          n:n,
          d:1
        };
    }else if(1 - error < x){
        return {
          n:n+1,
          d:1
        };
    }
    // The lower fraction is 0/1
    let lower_n = 0;
    let lower_d = 1;
    // The upper fraction is 1/1
    let upper_n = 1;
    let upper_d = 1;
    let middle_n = lower_n + upper_n;
    let middle_d = lower_d + upper_d;
    while(true){
        // The middle fraction is (lower_n + upper_n) / (lower_d + upper_d)
        middle_n = lower_n + upper_n;
        middle_d = lower_d + upper_d;
        // If x + error < middle
        if(middle_d * (x + error) < middle_n){
            // middle is our new upper
            upper_n = middle_n;
            upper_d = middle_d;
            // Else If middle < x - error
        }else if(middle_n < (x - error) * middle_d){
            // middle is our new lower
            lower_n = middle_n;
            lower_d = middle_d;
            // Else middle is our best fraction
        }else{
            return {
              n: n * middle_d + middle_n,
              d: middle_d
            };
        }
    }
}

function toFrac(frac){
    return {
      display: (frac.n + '/' + frac.d),
      numerator: frac.n,
      denominator: frac.d,
      original: frac
    };
}
