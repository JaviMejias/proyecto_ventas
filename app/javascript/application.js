import toastr from "toastr"
import "./controllers"

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
  timeOut: "3000",
  extendedTimeOut: "1000",
}