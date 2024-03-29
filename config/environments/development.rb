Site::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb
  config.before_configuration do
    env_file = File.join(Rails.root, 'config', 'env.yml')
    YAML.load(File.open(env_file)).each do |key, value|
      ENV[key.to_s] = value
    end if File.exists?(env_file)
  end

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  # Raise exception on mass assignment protection for Active Record models
  config.active_record.mass_assignment_sanitizer = :strict

  # Log the query plan for queries taking more than this (works
  # with SQLite, MySQL, and PostgreSQL)
  config.active_record.auto_explain_threshold_in_seconds = 0.5

  # Compress assets
  config.assets.compress = false

  # Expands the lines which load the assets
  config.assets.debug = true

  # Compress JS (config.assets.compress must be true)
  config.assets.js_compressor = :uglifier
  
  # Still in BUG-MODE
  # config.assets.css_compressor = :scss


  # EMAILS SETTINGS ABOVE
  config.action_mailer.raise_delivery_errors = true

  # set delivery method to :smtp, :sendmail or :test
  config.action_mailer.delivery_method = :smtp

	# these options are only needed if you choose smtp delivery
	config.action_mailer.smtp_settings = {
		:address        => 'smtp.gmail.com',
		:port           => 587,
		:domain         => 'www.pandox.com.br',
		:authentication => :login,
		:user_name      => 'matheus.messora.vpn@gmail.com',
		:password       => ENV['GMAIL_PASSWORD']
	}


end
