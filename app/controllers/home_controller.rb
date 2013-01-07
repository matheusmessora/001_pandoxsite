class HomeController < ApplicationController
  def contato
  	ContactMailer.welcome("teste").deliver
  end
end
