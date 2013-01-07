class HomeController < ApplicationController
  def contato
  	logger.info "TESTE TESTE TESTE"
  	mail = ContactMailer.welcome("nome_teste", "mmm@mmm.com")
  	mail.deliver
  end
end
