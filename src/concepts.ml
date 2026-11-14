(* concepts.ml - demonstrates core OCaml / functional-programming concepts *)

(* Concept: recursion *)
(* factorial computes n! by recursing down to the base case 0. *)
let rec factorial n =
  if n = 0 then 1
  else n * factorial (n - 1)

(* Concept: pattern matching *)
(* describe uses pattern matching to branch on the shape/value of its input. *)
let describe n =
  match n with
  | 0 -> "zero"
  | 1 -> "one"
  | n when n < 0 -> "negative"
  | _ -> "many"

(* Concept: higher-order functions over lists *)
(* double_all uses List.map, a higher-order function, to transform every
   element of a list without writing an explicit loop. *)
let double_all lst =
  List.map (fun x -> x * 2) lst

(* sum_all uses List.fold_left, another higher-order function, to reduce a
   list to a single accumulated value. *)
let sum_all lst =
  List.fold_left (fun acc x -> acc + x) 0 lst

(* Concept: immutability *)
(* original is bound once and never mutated; doubled is a brand-new list
   produced from it. Both names remain valid and distinct afterward,
   demonstrating that OCaml values are immutable by default. *)
let original = [ 1; 2; 3; 4 ]
let doubled = double_all original

let () =
  Printf.printf "factorial 5 = %d\n" (factorial 5);
  Printf.printf "describe 0 = %s\n" (describe 0);
  Printf.printf "describe 1 = %s\n" (describe 1);
  Printf.printf "describe (-3) = %s\n" (describe (-3));
  Printf.printf "describe 42 = %s\n" (describe 42);
  Printf.printf "original = [%s]\n"
    (String.concat "; " (List.map string_of_int original));
  Printf.printf "doubled = [%s]\n"
    (String.concat "; " (List.map string_of_int doubled));
  Printf.printf "sum_all original = %d\n" (sum_all original)

(* Expected output (hand-traced: `ocaml` binary unavailable in this
   environment; derived by manually evaluating each expression above):
   factorial 5 = 120
   describe 0 = zero
   describe 1 = one
   describe (-3) = negative
   describe 42 = many
   original = [1; 2; 3; 4]
   doubled = [2; 4; 6; 8]
   sum_all original = 10
*)
