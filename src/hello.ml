(* hello.ml - Concept: hello-world / basic I/O *)
(* The simplest OCaml program: print a greeting to stdout. *)
let hello () = print_endline "Hello, world!"
let () = hello ()
(* Expected output (hand-traced: `ocaml` binary unavailable in this
   environment, output derived by reading the code since print_endline
   simply writes the string followed by a newline):
   Hello, world!
*)
